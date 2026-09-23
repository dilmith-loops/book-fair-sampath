<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$route = isset($_GET['route']) ? trim($_GET['route'], '/') : '';
$method = $_SERVER['REQUEST_METHOD'];
$body = json_decode(file_get_contents('php://input'), true) ?? [];

$dataDir = __DIR__;
$stallsFile = $dataDir . '/stalls.json';
$spotsFile = $dataDir . '/spots.json';

// Helper to get spots
function getSpots($spotsFile) {
    if (file_exists($spotsFile)) {
        $content = file_get_contents($spotsFile);
        $data = json_decode($content, true);
        if (is_array($data)) return $data;
    }
    return [];
}

// Helper to save spots
function saveSpots($spotsFile, $spots) {
    file_put_contents($spotsFile, json_encode($spots, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

// 1. Health check
if ($route === 'health') {
    echo json_encode([
        'status' => 'ok',
        'event' => 'BMICH Book Fair 2026',
        'sponsor' => 'Sampath Bank PLC',
        'dates' => '25th Sep - 4th Oct 2026'
    ]);
    exit;
}

// 2. Get Stalls
if ($route === 'stalls' && $method === 'GET') {
    if (file_exists($stallsFile)) {
        $stalls = json_decode(file_get_contents($stallsFile), true) ?? [];
        echo json_encode(['stalls' => $stalls]);
    } else {
        echo json_encode(['stalls' => []]);
    }
    exit;
}

// 3. Spots: GET or POST
if ($route === 'spots') {
    if ($method === 'GET') {
        $spots = getSpots($spotsFile);
        usort($spots, function($a, $b) {
            return ($b['timestamp'] ?? 0) - ($a['timestamp'] ?? 0);
        });
        echo json_encode(['spots' => $spots]);
        exit;
    }

    if ($method === 'POST') {
        $bookName = trim($body['bookName'] ?? '');
        $stallName = trim($body['stallName'] ?? 'General Community Notice');
        $hall = trim($body['hall'] ?? 'All Halls');
        $isRequest = !empty($body['isRequest']);

        if (empty($bookName)) {
            http_response_code(400);
            echo json_encode(['error' => 'Book title or request description is required.']);
            exit;
        }

        $spots = getSpots($spotsFile);
        $newSpot = [
            'id' => 'spot-' . round(microtime(true) * 1000) . '-' . substr(bin2hex(random_bytes(4)), 0, 7),
            'bookName' => $bookName,
            'stallName' => $stallName,
            'hall' => $hall,
            'stallNumber' => trim($body['stallNumber'] ?? ''),
            'priceOrOffer' => trim($body['priceOrOffer'] ?? ''),
            'images' => is_array($body['images'] ?? null) ? $body['images'] : [],
            'shelfLocationNote' => trim($body['shelfLocationNote'] ?? ''),
            'notes' => trim($body['notes'] ?? ''),
            'finderName' => trim($body['finderName'] ?? 'Sampath Guest'),
            'finderHandle' => trim($body['finderHandle'] ?? 'guest'),
            'timestamp' => round(microtime(true) * 1000),
            'status' => $isRequest ? 'Looking for Book' : 'In Stock',
            'helpfulCount' => 0,
            'ratings' => [],
            'isVerifiedSampath' => !empty($body['isVerifiedSampath']),
            'isRequest' => $isRequest,
            'replyToRequestId' => $body['replyToRequestId'] ?? null,
            'taggedRequesterName' => $body['taggedRequesterName'] ?? null,
            'taggedRequesterHandle' => $body['taggedRequesterHandle'] ?? null
        ];

        array_unshift($spots, $newSpot);
        saveSpots($spotsFile, $spots);

        echo json_encode(['success' => true, 'spot' => $newSpot]);
        exit;
    }
}

// 4. Spot Actions: upvote, status, rate
if (preg_match('#^spots/([^/]+)/(upvote|status|rate)$#', $route, $matches)) {
    $spotId = $matches[1];
    $action = $matches[2];
    $spots = getSpots($spotsFile);
    $found = false;

    foreach ($spots as &$s) {
        if (($s['id'] ?? '') === $spotId) {
            $found = true;
            if ($action === 'upvote') {
                $s['helpfulCount'] = ($s['helpfulCount'] ?? 0) + 1;
            } elseif ($action === 'status') {
                $newStatus = $body['status'] ?? '';
                if (in_array($newStatus, ['In Stock', 'Few Copies Left', 'Sold Out', 'Looking for Book', 'Found'])) {
                    $s['status'] = $newStatus;
                }
            } elseif ($action === 'rate') {
                $score = intval($body['score'] ?? 0);
                if ($score >= 1 && $score <= 5) {
                    if (!isset($s['ratings']) || !is_array($s['ratings'])) {
                        $s['ratings'] = [];
                    }
                    $s['ratings'][] = $score;
                }
            }
            break;
        }
    }

    if ($found) {
        saveSpots($spotsFile, $spots);
        echo json_encode(['success' => true]);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Spotting not found']);
    }
    exit;
}

// 5. Image moderation pre-check
if ($route === 'moderate-image') {
    echo json_encode(['isClean' => true]);
    exit;
}

// Default 404
http_response_code(404);
echo json_encode(['error' => 'Endpoint not found', 'route' => $route]);
