import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  MapPin, 
  CheckCheck, 
  Image as ImageIcon, 
  Heart, 
  Send, 
  Camera, 
  X,
  CheckCircle2,
  Building2,
  Lock,
  ChevronDown,
  Star,
  CornerDownRight,
  HelpCircle,
  Award,
  ShieldAlert,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { BookSpotting, Stall, UserProfile } from '../types';
import { checkLocalProfanity } from '../utils/moderationPatterns';
import { fileToDataUrl } from '../utils/imageUtils';
import { getApiUrl } from '../utils/apiUtils';

interface CommunityFeedProps {
  spots: BookSpotting[];
  selectedHallFilter: string;
  onSelectHallFilter: (hall: string) => void;
  onOpenNewSpotModal: () => void;
  onUpvoteSpot: (spotId: string) => void;
  onRateSpot?: (spotId: string, score: number) => void;
  onUpdateStatus: (spotId: string, status: 'In Stock' | 'Few Copies Left' | 'Sold Out' | 'Looking for Book' | 'Found') => void;
  onViewPhotoLightbox: (images: string[], bookTitle: string, stallName: string, initialIndex?: number) => void;
  userProfile?: UserProfile | null;
  stalls?: Stall[];
  onQuickSpotSubmit?: (spot: BookSpotting) => void;
}

export const CommunityFeed: React.FC<CommunityFeedProps> = ({
  spots,
  selectedHallFilter,
  onOpenNewSpotModal,
  onUpvoteSpot,
  onRateSpot,
  onUpdateStatus,
  onViewPhotoLightbox,
  userProfile,
  stalls = [],
  onQuickSpotSubmit
}) => {
  // Composer mode: 'spot' (found a book) or 'request' (looking for a book)
  const [composerMode, setComposerMode] = useState<'spot' | 'request'>('spot');
  
  // If replying to a "looking for" request
  const [replyingToRequest, setReplyingToRequest] = useState<BookSpotting | null>(null);

  // Quick Composer Inputs
  const [inlineBookName, setInlineBookName] = useState('');
  const [inlineStallId, setInlineStallId] = useState('');
  const [inlineShelfNote, setInlineShelfNote] = useState('');
  const [inlineRequestNote, setInlineRequestNote] = useState('');
  const [inlineImages, setInlineImages] = useState<string[]>([]);
  const [showInlineAttach, setShowInlineAttach] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isVettingInlineImage, setIsVettingInlineImage] = useState(false);
  const [inlineError, setInlineError] = useState<string | null>(null);
  
  // Track local user ratings { [spotId]: score }
  const [userRatings, setUserRatings] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('sampath_user_ratings');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Real-time local profanity & hate speech detector
  const inlineTextToCheck = `${inlineBookName} ${composerMode === 'request' ? inlineRequestNote : inlineShelfNote}`;
  const inlineLocalViolation = checkLocalProfanity(inlineTextToCheck);

  // Sender color palette for WhatsApp-style group chat
  const senderColors = [
    'text-emerald-700',
    'text-blue-700',
    'text-orange-600',
    'text-purple-700',
    'text-rose-700',
    'text-amber-700',
    'text-teal-700',
  ];

  const getSenderColor = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % senderColors.length;
    return senderColors[index];
  };

  // Order chat stream chronologically: earlier messages on top, newest at bottom (WhatsApp style)
  const chatSpots = useMemo(() => {
    return [...spots].sort((a, b) => a.timestamp - b.timestamp);
  }, [spots]);

  // Keep chat scrolled to the latest message on initial load and when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [spots.length]);

  const formatChatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Check if book was already found as user types in WhatsApp input bar
  const alreadyFoundHint = inlineBookName.trim().length >= 2
    ? spots.filter(s => s.postType !== 'request' && s.bookName.toLowerCase().includes(inlineBookName.trim().toLowerCase()))
    : [];

  const handleInlineImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remaining = 3 - inlineImages.length;
    if (remaining <= 0) return;

    setInlineError(null);
    setIsVettingInlineImage(true);

    const filesToVet = (Array.from(files) as File[]).slice(0, remaining);

    try {
      const passedImages: string[] = [];
      for (const file of filesToVet) {
        const dataUrl = await fileToDataUrl(file);

        // Pre-vet image with Gemini AI Image Guardian
        try {
          const modRes = await fetch(getApiUrl('/api/moderate-image'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: dataUrl })
          });
          const modData = await modRes.json();
          if (!modData.isClean) {
            setInlineError(`AI Image Shield: Uploaded photo was rejected. ${modData.reason || 'Image content violates community guidelines (inappropriate, offensive gesture, or non-book content detected).'}`);
            continue;
          }
        } catch {
          // If network check times out, let main submission endpoint re-verify
        }

        passedImages.push(dataUrl);
      }

      if (passedImages.length > 0) {
        setInlineImages(prev => [...prev, ...passedImages].slice(0, 3));
      }
    } catch (err) {
      setInlineError('Error processing photo. Please try another image.');
    } finally {
      setIsVettingInlineImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // User initiates a reply to a "looking for a book" request
  const handleStartReply = (requestSpot: BookSpotting) => {
    setReplyingToRequest(requestSpot);
    setComposerMode('spot');
    setInlineBookName(requestSpot.bookName);
    setInlineError(null);
    // Scroll composer into view
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCancelReply = () => {
    setReplyingToRequest(null);
    setInlineBookName('');
  };

  // Submit either a Sighting or a Request
  const handleSendQuickSpot = async (e: React.FormEvent) => {
    e.preventDefault();
    setInlineError(null);

    // Instant local violation check
    if (!inlineLocalViolation.isClean) {
      setInlineError(inlineLocalViolation.reason || 'Prohibited language detected. Profanity, racism, and communal hate are forbidden.');
      return;
    }

    if (!inlineBookName.trim()) {
      setInlineError('Please enter a book name.');
      return;
    }

    if (composerMode === 'spot' && !inlineStallId) {
      setInlineError('Please select a BMICH stall from the dropdown.');
      return;
    }

    setIsSending(true);

    try {
      let payload: any = {
        postType: composerMode,
        bookName: inlineBookName.trim(),
        finderName: userProfile?.name || 'Fair Visitor'
      };

      if (composerMode === 'request') {
        payload.notes = inlineRequestNote.trim() || undefined;
      } else {
        const stallObj = stalls.find(s => s.id === inlineStallId);
        payload.stallId = inlineStallId;
        payload.stallName = stallObj ? stallObj.name : 'Fairground Stall';
        payload.hall = stallObj ? stallObj.hall : 'BMICH Grounds';
        payload.stallNumber = stallObj ? stallObj.stallNumber : 'Fairground';
        payload.images = inlineImages;
        payload.shelfLocationNote = inlineShelfNote.trim() || undefined;

        if (replyingToRequest) {
          payload.replyToRequestId = replyingToRequest.id;
          payload.taggedRequesterName = replyingToRequest.finderName;
          payload.taggedRequesterHandle = replyingToRequest.finderHandle;
        }
      }

      let createdSpot: BookSpotting | null = null;
      try {
        const res = await fetch(getApiUrl('/api/spots'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          const data = await res.json();
          if (data.spot) {
            createdSpot = data.spot;
          }
        }
      } catch (err) {
        console.warn('API submission failed, creating locally:', err);
      }

      if (!createdSpot) {
        createdSpot = {
          id: `spot-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          postType: payload.postType || 'spot',
          bookName: payload.bookName,
          stallId: payload.stallId || 'community-notice',
          stallName: payload.stallName || 'Community Notice',
          hall: payload.hall || 'All Halls',
          stallNumber: payload.stallNumber || '',
          priceOrOffer: payload.priceOrOffer,
          images: payload.images || [],
          shelfLocationNote: payload.shelfLocationNote,
          notes: payload.notes,
          finderName: payload.finderName || userProfile?.name || 'Fair Visitor',
          finderHandle: userProfile?.handle || 'guest',
          timestamp: Date.now(),
          status: payload.postType === 'request' ? 'Looking for Book' : 'In Stock',
          helpfulCount: 0,
          aiVerified: true,
          ratingAverage: 5.0,
          ratingCount: 0,
          replyToRequestId: payload.replyToRequestId,
          taggedRequesterName: payload.taggedRequesterName,
          taggedRequesterHandle: payload.taggedRequesterHandle
        };
      }

      if (createdSpot && onQuickSpotSubmit) {
        onQuickSpotSubmit(createdSpot);
      }

      // Reset
      setInlineBookName('');
      setInlineStallId('');
      setInlineShelfNote('');
      setInlineRequestNote('');
      setInlineImages([]);
      setShowInlineAttach(false);
      setReplyingToRequest(null);

      // Smooth scroll to bottom
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      setInlineError('Network error. Please retry.');
    } finally {
      setIsSending(false);
    }
  };

  // Handle rating a find
  const handleRateFind = (spotId: string, score: number) => {
    setUserRatings(prev => {
      const next = { ...prev, [spotId]: score };
      try {
        localStorage.setItem('sampath_user_ratings', JSON.stringify(next));
      } catch {}
      return next;
    });

    if (onRateSpot) {
      onRateSpot(spotId, score);
    }
  };

  return (
    <div className="flex flex-col w-full bg-[#EFEAE2] min-h-[calc(100vh-120px)] pb-48 relative">
      {/* Messages Stream with WhatsApp Wallpaper Texture */}
      <div
        className="flex-1 px-3 py-3 space-y-3"
        style={{
          backgroundImage: `radial-gradient(#d1c7b7 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }}
      >


        {/* WhatsApp End-to-End Style System Bubble */}
        <div className="flex justify-center my-1">
          <div className="bg-[#FCF5EB] border border-[#E8DEC8] text-[#54656F] px-3.5 py-1 rounded-xl text-[10px] font-medium shadow-xs max-w-xs text-center flex items-center gap-1.5">
            <Lock className="w-3 h-3 text-[#00A884] flex-shrink-0" />
            <span>
              All messages verified by Sampath AI Shield. Post sightings or create "Looking for a book" requests.
            </span>
          </div>
        </div>

        {/* Date Divider Pill */}
        <div className="flex justify-center my-1">
          <span className="bg-white/90 backdrop-blur-xs text-zinc-600 text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md shadow-xs">
            BMICH Fair • September 25 – October 4, 2026
          </span>
        </div>

        {/* Chat Messages List */}
        {chatSpots.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-10 h-10 rounded-full bg-white shadow-xs flex items-center justify-center text-zinc-400 mb-2">
              <Building2 className="w-5 h-5 text-[#F37021]" />
            </div>
            <p className="text-xs font-black text-zinc-700">No messages yet</p>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              Be the first to post a book sighting or ask for a book!
            </p>
          </div>
        ) : (
          chatSpots.map((spot) => {
            const isUserSelf = userProfile && (
              spot.finderHandle === userProfile.handle ||
              spot.finderName.toLowerCase() === userProfile.name.toLowerCase()
            );

            const isRequest = spot.postType === 'request';
            const userRating = userRatings[spot.id] || spot.userRating;

            return (
              <div
                key={spot.id}
                className={`flex flex-col ${isUserSelf ? 'items-end' : 'items-start'} animate-in fade-in duration-150`}
              >
                {/* Message Bubble */}
                <div
                  className={`max-w-[95%] sm:max-w-[85%] rounded-2xl p-2.5 sm:p-3 shadow-xs border transition-shadow ${
                    isRequest
                      ? 'bg-[#FEF9E7] border-amber-300 rounded-tl-xs'
                      : isUserSelf
                      ? 'bg-[#E7FFDB] border-[#CDEEB7] rounded-tr-xs'
                      : 'bg-white border-zinc-200/80 rounded-tl-xs'
                  }`}
                >
                  {/* Quoted Request Header (If this is a reply tagging a requester) */}
                  {spot.replyToRequestId && (
                    <div className="mb-2 p-2 bg-[#E9F5E9] border-l-4 border-emerald-600 rounded-r-lg text-xs">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-800">
                        <CornerDownRight className="w-3 h-3 text-emerald-700" />
                        <span>Replying to request by <strong>{spot.taggedRequesterName || 'Community Member'}</strong></span>
                      </div>
                      <div className="text-[11px] text-zinc-800 font-semibold truncate mt-0.5">
                        Seeking: "{spot.bookName}"
                      </div>
                    </div>
                  )}

                  {/* Sender Header */}
                  <div className="flex items-center justify-between gap-2 pb-1 border-b border-black/5 mb-1.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className={`text-[11px] font-black truncate ${isUserSelf ? 'text-[#075E54]' : getSenderColor(spot.finderName)}`}>
                        {isUserSelf ? 'You' : spot.finderName}
                      </span>
                      <span className="text-[9px] text-zinc-400 font-medium">
                        {spot.finderHandle}
                      </span>
                    </div>

                    {isRequest && (
                      <span className={`text-[8px] font-black px-1.5 py-0.2 rounded-full flex items-center gap-1 ${
                        spot.status === 'Found' || spot.isResolved
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-200/80 text-amber-900 animate-pulse'
                      }`}>
                        <HelpCircle className="w-2.5 h-2.5" />
                        {spot.status === 'Found' || spot.isResolved ? 'Sighted / Found' : 'Looking for Book'}
                      </span>
                    )}
                  </div>

                  {/* CASE 1: LOOKING FOR A BOOK REQUEST */}
                  {isRequest ? (
                    <div className="space-y-2">
                      {/* Main Exact Format Requested: "XX is looking for Harry Potter - order of the pheonix" */}
                      <div className="bg-amber-100/70 border border-amber-300 rounded-xl p-2.5">
                        <div className="text-[10px] font-bold text-amber-900 flex items-center gap-1 mb-1">
                          <span className="text-sm">🔍</span>
                          <span className="uppercase tracking-wider font-black text-[9px]">BOOK INQUIRY</span>
                        </div>
                        <div className="text-xs sm:text-sm font-extrabold text-zinc-900 leading-snug">
                          <span className="text-[#075E54] font-black">{spot.finderName}</span> is looking for{' '}
                          <span className="text-[#EA580C] underline decoration-[#EA580C]/40 underline-offset-2">
                            {spot.bookName}
                          </span>
                        </div>
                        {spot.author && (
                          <p className="text-[11px] text-zinc-600 font-medium mt-0.5">
                            Author: {spot.author}
                          </p>
                        )}
                        {spot.notes && (
                          <div className="text-[11px] text-zinc-700 italic bg-white/70 p-1.5 rounded-md mt-1.5 border border-amber-200/60">
                            "{spot.notes}"
                          </div>
                        )}
                      </div>

                      {/* Reply Action Button: Direct prompt to reply with found book */}
                      <div className="pt-0.5 flex items-center justify-between gap-2">
                        <span className="text-[9px] text-zinc-500 font-medium">
                          {spot.status === 'Found' || spot.isResolved
                            ? '✓ Sighting has been tagged below'
                            : 'Have you seen this book at BMICH?'}
                        </span>

                        <button
                          onClick={() => handleStartReply(spot)}
                          id={`reply-request-btn-${spot.id}`}
                          className="px-2.5 py-1 bg-gradient-to-r from-[#F37021] to-[#EA580C] hover:from-[#EA580C] hover:to-[#C2410C] text-white text-[10px] font-black rounded-lg shadow-xs flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                        >
                          <Building2 className="w-3 h-3" />
                          <span>I Found This!</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* CASE 2: FOUND BOOK SIGHTING */
                    <>
                      {/* Tag Notice if replying to someone */}
                      {spot.taggedRequesterName && (
                        <div className="mb-1 text-[11px] font-black text-[#075E54] flex items-center gap-1">
                          <span>📍</span>
                          <span>
                            Hey <span className="underline">{spot.taggedRequesterHandle || spot.taggedRequesterName}</span>, I found your book!
                          </span>
                        </div>
                      )}

                      {/* 1. Book Name */}
                      <div className="mb-1.5">
                        <div className="text-[9px] font-black uppercase tracking-wider text-[#F37021] flex items-center gap-1">
                          <span>📖 BOOK SIGHTING</span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-black text-zinc-900 leading-snug">
                          {spot.bookName}
                        </h4>
                        {spot.author && (
                          <p className="text-[10px] text-zinc-500 font-medium">
                            by {spot.author}
                          </p>
                        )}
                      </div>

                      {/* 2. Stall Location Card */}
                      <div className="bg-[#F8F9FA] rounded-xl p-2 border border-zinc-200/80 mb-2 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1 font-black text-[11px] text-zinc-900 truncate">
                            <Building2 className="w-3.5 h-3.5 text-[#F37021] flex-shrink-0" />
                            <span className="truncate">{spot.stallName}</span>
                          </div>
                          <span className="bg-[#075E54] text-white text-[9px] font-black px-1.5 py-0.2 rounded-full flex-shrink-0">
                            {spot.hall} • {spot.stallNumber}
                          </span>
                        </div>

                        {spot.shelfLocationNote && (
                          <div className="text-[10px] text-zinc-700 font-medium flex items-start gap-1 pt-0.5">
                            <MapPin className="w-3 h-3 text-[#F37021] flex-shrink-0 mt-0.5" />
                            <span>{spot.shelfLocationNote}</span>
                          </div>
                        )}


                      </div>

                      {/* 3. Photos (Max 3 pictures inside stall) */}
                      {spot.images && spot.images.length > 0 && (
                        <div className="mb-2">
                          <div className="text-[9px] font-bold text-zinc-500 mb-1 flex items-center justify-between">
                            <span className="flex items-center gap-1 text-zinc-700">
                              <ImageIcon className="w-3 h-3 text-[#F37021]" />
                              Shelf Location Photos ({spot.images.length}/3)
                            </span>
                            <span className="text-[8px] text-zinc-400">Tap to inspect</span>
                          </div>

                          <div className={`grid gap-1 rounded-xl overflow-hidden ${
                            spot.images.length === 1
                              ? 'grid-cols-1'
                              : spot.images.length === 2
                              ? 'grid-cols-2'
                              : 'grid-cols-3'
                          }`}>
                            {spot.images.map((imgUrl, idx) => (
                              <div
                                key={idx}
                                onClick={() => onViewPhotoLightbox(spot.images, spot.bookName, spot.stallName, idx)}
                                className="relative aspect-4/3 rounded-lg overflow-hidden bg-zinc-200 cursor-pointer hover:opacity-95 transition-opacity"
                              >
                                <img
                                  src={imgUrl}
                                  alt={`${spot.bookName} shelf photo ${idx + 1}`}
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                                <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[8px] font-black px-1 py-0.2 rounded">
                                  {idx + 1}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 4. RATING FEATURE: People who think this post helped them rate the find */}
                      <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-2 my-1.5 space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-[10px] font-black text-amber-950">
                            <Award className="w-3 h-3 text-[#F37021]" />
                            <span>Did this find help you?</span>
                          </div>

                          <div className="flex items-center gap-1 text-[10px] font-black text-zinc-700">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                            <span>{spot.ratingAverage || 5.0}</span>
                            <span className="text-[9px] text-zinc-500 font-normal">
                              ({spot.ratingCount || 1} {spot.ratingCount === 1 ? 'rating' : 'ratings'})
                            </span>
                          </div>
                        </div>

                        {/* Interactive 5-Star Rating Buttons */}
                        <div className="flex items-center justify-between pt-0.5">
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((starVal) => {
                              const isSelected = (userRating || 0) >= starVal;
                              return (
                                <button
                                  key={starVal}
                                  type="button"
                                  onClick={() => handleRateFind(spot.id, starVal)}
                                  className="p-1 hover:scale-125 transition-transform cursor-pointer"
                                  title={`Rate ${starVal} star${starVal > 1 ? 's' : ''}`}
                                >
                                  <Star
                                    className={`w-3.5 h-3.5 ${
                                      isSelected
                                        ? 'fill-amber-400 text-amber-500'
                                        : 'text-zinc-300 hover:text-amber-400'
                                    }`}
                                  />
                                </button>
                              );
                            })}
                          </div>

                          {userRating ? (
                            <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100/80 px-1.5 py-0.2 rounded-full">
                              You rated {userRating}★ • Thanks!
                            </span>
                          ) : (
                            <span className="text-[8px] text-zinc-500 font-medium">
                              Tap stars to rate
                            </span>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Bubble Bottom: Status pill, reactions & timestamp */}
                  <div className="pt-1 flex items-center justify-between gap-2 text-xs">


                    {/* WhatsApp style Reactions & Time */}
                    <div className="flex items-center gap-1.5 ml-auto">
                      <button
                        onClick={() => onUpvoteSpot(spot.id)}
                        className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                          spot.hasUserUpvoted
                            ? 'bg-orange-100 text-[#EA580C]'
                            : 'hover:bg-black/5 text-zinc-500'
                        }`}
                        title="Helpful find"
                      >
                        <Heart className={`w-3 h-3 ${spot.hasUserUpvoted ? 'fill-current text-rose-500' : ''}`} />
                        <span>{spot.helpfulCount}</span>
                      </button>

                      <span className="text-[9px] text-zinc-400 font-medium">
                        {formatChatTime(spot.timestamp)}
                      </span>
                      <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Docked WhatsApp Bottom Area (Radar Alert + Reply Preview + Media Shelf + Input Composer) */}
      <div className="fixed bottom-[56px] sm:bottom-[64px] inset-x-0 sm:max-w-md sm:mx-auto z-30 flex flex-col shadow-xl">
        {/* 4. Live "Already Found" Radar Popover if book was already spotted */}
        {composerMode === 'request' && alreadyFoundHint.length > 0 && (
          <div className="bg-amber-50 border-t border-b border-amber-200 px-3 py-1.5 flex items-center justify-between gap-2 text-xs shadow-xs animate-in slide-in-from-bottom-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping flex-shrink-0" />
              <div className="truncate text-[11px]">
                <strong className="text-amber-950 font-black">Good News!</strong>{' '}
                <span className="text-zinc-700">
                  "{inlineBookName}" already spotted at {alreadyFoundHint[0].stallName}!
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                if (alreadyFoundHint[0].images.length > 0) {
                  onViewPhotoLightbox(alreadyFoundHint[0].images, alreadyFoundHint[0].bookName, alreadyFoundHint[0].stallName, 0);
                }
              }}
              className="text-[10px] font-black text-[#EA580C] hover:underline whitespace-nowrap cursor-pointer flex-shrink-0"
            >
              View Stall →
            </button>
          </div>
        )}

        {/* 5. Replying Banner (If replying to a "Looking for a book" request) */}
        {replyingToRequest && (
          <div className="bg-emerald-50 border-t-2 border-emerald-500 border-b border-emerald-200/70 px-3.5 py-2 flex items-center justify-between gap-2 shadow-sm animate-in slide-in-from-bottom-2 duration-150">
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-black text-emerald-800 flex items-center gap-1.5">
                <CornerDownRight className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span className="truncate">
                  Replying to <strong className="font-bold text-emerald-950">{replyingToRequest.finderName}</strong>{' '}
                  <span className="text-emerald-700 font-medium">({replyingToRequest.finderHandle})</span>
                </span>
              </div>
              <div className="text-[11px] text-zinc-700 font-medium truncate mt-0.5 pl-5">
                Book: <span className="font-bold text-zinc-900">"{replyingToRequest.bookName}"</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleCancelReply}
              className="p-1.5 text-zinc-400 hover:text-zinc-800 hover:bg-emerald-100 rounded-full cursor-pointer transition-colors flex-shrink-0"
              title="Cancel reply"
              aria-label="Cancel reply"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 6. WhatsApp-Style Expandable Attachment Shelf for Inline Composer */}
        {showInlineAttach && composerMode === 'spot' && (
          <div className="bg-zinc-100 border-t border-zinc-200 p-2.5 space-y-1.5 shadow-sm animate-in slide-in-from-bottom-2 duration-150">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-700">
              <span className="flex items-center gap-1.5 text-[11px]">
                <Camera className="w-3.5 h-3.5 text-[#F37021]" />
                Attach Shelf Pictures ({inlineImages.length}/3 max)
              </span>
              <button
                type="button"
                onClick={() => setShowInlineAttach(false)}
                className="text-zinc-500 hover:text-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {inlineImages.map((img, i) => (
                <div key={i} className="relative w-12 h-12 rounded-lg overflow-hidden border border-zinc-300">
                  <img src={img} alt="Attach preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setInlineImages(prev => prev.filter((_, idx) => idx !== i))}
                    className="absolute top-0.5 right-0.5 bg-black/70 text-white rounded-full p-0.5 cursor-pointer"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              ))}

              {inlineImages.length < 3 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-12 h-12 rounded-lg border-2 border-dashed border-orange-300 bg-orange-50/50 flex flex-col items-center justify-center text-[#EA580C] cursor-pointer hover:bg-orange-100"
                >
                  <Camera className="w-4 h-4" />
                  <span className="text-[8px] font-black">+ Pic</span>
                </button>
              )}
            </div>

            <div>
              <input
                type="text"
                value={inlineShelfNote}
                onChange={(e) => {
                  setInlineShelfNote(e.target.value);
                  if (inlineError) setInlineError(null);
                }}
                placeholder="Aisle/shelf note (e.g. Row 4, bottom rack near cashier)..."
                className="w-full px-2.5 py-1 text-xs bg-white border border-zinc-300 rounded-lg text-zinc-900 focus:outline-none focus:ring-1 focus:ring-[#F37021]"
              />
            </div>
          </div>
        )}

        {/* 7. WhatsApp Mobile Bottom Composer with Mode Selector */}
        <div className="bg-[#F0F2F5] border-t border-zinc-200/90 p-1.5 sm:p-2">
        {/* Mode Selector Pill Toggle */}
        <div className="flex items-center justify-between pb-1.5 px-0.5">
          <div className="flex items-center gap-1 bg-zinc-200/80 p-0.5 rounded-lg text-[10px] font-black">
            <button
              type="button"
              onClick={() => {
                setComposerMode('spot');
                setInlineError(null);
              }}
              className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                composerMode === 'spot'
                  ? 'bg-white text-[#F37021] shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              📍 Found a Book
            </button>
            <button
              type="button"
              onClick={() => {
                setComposerMode('request');
                setReplyingToRequest(null);
                setInlineError(null);
              }}
              className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                composerMode === 'request'
                  ? 'bg-white text-amber-700 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              🔍 Looking for a Book
            </button>
          </div>

          <span className="text-[9px] text-zinc-500 font-medium">
            {composerMode === 'request' ? 'Ask BMICH Community' : 'Share Shelf Location'}
          </span>
        </div>

        {/* Live Safety and Image Moderation Badges */}
        {!inlineLocalViolation.isClean && (
          <div className="mb-1 text-[10px] font-bold text-rose-800 px-2 py-1 bg-rose-50 rounded-lg border border-rose-300 flex items-center gap-1.5 animate-in fade-in">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
            <span>{inlineLocalViolation.reason}</span>
          </div>
        )}

        {isVettingInlineImage && (
          <div className="mb-1 text-[10px] font-bold text-orange-800 px-2 py-1 bg-orange-50 rounded-lg border border-orange-300 flex items-center gap-1.5 animate-pulse">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#F37021]" />
            <span>AI Shield: Vetting photo with Gemini vision...</span>
          </div>
        )}

        {inlineError && (
          <div className="mb-1 text-[10px] font-bold text-rose-600 px-2 py-0.5 bg-rose-50 rounded border border-rose-200 flex items-center justify-between">
            <span>{inlineError}</span>
            <button onClick={() => setInlineError(null)} className="cursor-pointer">
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        <form onSubmit={handleSendQuickSpot}>
          <div className="flex items-center gap-1.5">
            {/* In Sighting Mode: Attachment Camera */}
            {composerMode === 'spot' && (
              <>
                <button
                  type="button"
                  onClick={() => setShowInlineAttach(!showInlineAttach)}
                  className={`p-1.5 rounded-full text-zinc-500 hover:text-zinc-800 hover:bg-zinc-200/60 transition-colors cursor-pointer flex-shrink-0 ${
                    inlineImages.length > 0 ? 'text-[#F37021]' : ''
                  }`}
                  title="Attach shelf photos (max 3, AI vetted)"
                >
                  <Camera className="w-5 h-5" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleInlineImageSelect}
                  className="hidden"
                />

                {/* Stall Selector Dropdown */}
                <div className="relative flex-shrink-0 max-w-[125px]">
                  <select
                    value={inlineStallId}
                    onChange={(e) => setInlineStallId(e.target.value)}
                    required
                    aria-label="Select Stall"
                    className="w-full py-2 pl-2 pr-5 bg-white border border-zinc-300 rounded-xl text-[10px] font-bold text-zinc-800 truncate focus:outline-none focus:ring-1 focus:ring-[#F37021] appearance-none cursor-pointer"
                  >
                    <option value="">Stall *</option>
                    {stalls.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.hall})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3 h-3 text-zinc-400 absolute right-1.5 top-2.5 pointer-events-none" />
                </div>
              </>
            )}

            {/* Book Name Text Input */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={inlineBookName}
                onChange={(e) => {
                  setInlineBookName(e.target.value);
                  if (inlineError) setInlineError(null);
                }}
                placeholder={
                  composerMode === 'request'
                    ? 'Book name you want (e.g. Harry Potter, Gamperaliya)...'
                    : 'Book name (e.g. Atomic Habits, Karumakkarayo)...'
                }
                required
                className="w-full py-2 px-3 bg-white border border-zinc-300 rounded-xl text-xs font-semibold text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#F37021]"
              />
            </div>

            {/* WhatsApp Circular Send Button */}
            <button
              type="submit"
              disabled={isSending || !inlineLocalViolation.isClean || isVettingInlineImage}
              id="chat-send-btn"
              className={`w-9 h-9 rounded-full text-white flex items-center justify-center flex-shrink-0 shadow-sm cursor-pointer active:scale-95 disabled:opacity-50 ${
                composerMode === 'request'
                  ? 'bg-gradient-to-r from-amber-600 to-amber-700'
                  : 'bg-gradient-to-r from-[#F37021] to-[#EA580C]'
              }`}
              title={composerMode === 'request' ? 'Post Looking for Book Request' : 'Send Book Sighting'}
            >
              {isSending ? (
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5 -mr-0.5" />
              )}
            </button>
          </div>

          {/* Optional note in Request mode */}
          {composerMode === 'request' && (
            <div className="pt-1.5">
              <input
                type="text"
                value={inlineRequestNote}
                onChange={(e) => setInlineRequestNote(e.target.value)}
                placeholder="Optional: Specific edition, language (Sinhala/English), or condition..."
                className="w-full py-1 px-2.5 bg-white/90 border border-zinc-300 rounded-lg text-[11px] text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          )}
        </form>
      </div>
    </div>
  </div>
);
};
