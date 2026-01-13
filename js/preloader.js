// ==========================================
// PRELOADER SCRIPT - ISOLATED
// Handles: SessionStorage, Video Preloading, Transition
// Prevents site flash and handles mobile video properly
// ==========================================

(function() {
    'use strict';
    
    // IMMEDIATE EXECUTION - Prevent flash
    const preloaderSeen = sessionStorage.getItem('nairoreelPreloaderSeen');
    const preloaderOverlay = document.getElementById('preloader-overlay');
    const preloaderSwitch = document.getElementById('preloader-switch');
    
    // If already seen, hide immediately and restore visibility
    if (preloaderSeen === 'true') {
        preloaderOverlay.style.display = 'none';
        document.documentElement.style.visibility = 'visible';
        // Ensure all content is visible
        document.querySelectorAll('body > *:not(.preloader-overlay)').forEach(el => {
            el.style.opacity = '1';
        });
        return; // Exit early
    }
    
    // First time visitor - show preloader and prepare page
    document.documentElement.style.visibility = 'visible'; // Make HTML visible now that preloader is ready
    document.body.classList.add('preloader-active');
    
    // Initialize variables
    let videoReady = false;
    let minimumTimeElapsed = false;
    
    // Detect if mobile/tablet
    const isMobileDevice = () => {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        // More comprehensive mobile detection
        return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet/i.test(userAgent.toLowerCase()) ||
               (navigator.maxTouchPoints && navigator.maxTouchPoints > 1) ||
               window.matchMedia("(max-width: 768px)").matches;
    };
    
    const isMobile = isMobileDevice();
    
    // Set minimum display time
    setTimeout(() => {
        minimumTimeElapsed = true;
    }, 2000);
    
    // Function to handle video readiness
    function setupVideoHandling() {
        const heroVideo = document.querySelector('.hero-video-bg video');
        
        if (!heroVideo) {
            videoReady = true;
            return;
        }
        
        if (isMobile) {
            // On mobile, don't wait for video - it might not autoplay
            // Just ensure poster is loaded and mark as ready
            const poster = heroVideo.getAttribute('poster');
            if (poster) {
                const img = new Image();
                img.onload = () => { videoReady = true; };
                img.onerror = () => { videoReady = true; }; // Ready even if poster fails
                img.src = poster;
            } else {
                videoReady = true;
            }
            
            // Also try to play video but don't wait for it
            heroVideo.play().catch(() => {
                // Video won't autoplay, that's okay on mobile
                console.log('Video autoplay blocked on mobile - using poster');
            });
            
        } else {
            // Desktop - wait for video to be ready
            const checkVideoReady = () => {
                if (heroVideo.readyState >= 3) {
                    videoReady = true;
                }
            };
            
            heroVideo.addEventListener('canplaythrough', () => {
                videoReady = true;
            });
            
            heroVideo.addEventListener('loadeddata', checkVideoReady);
            
            // Check if already ready
            checkVideoReady();
            
            // Try to load video
            if (heroVideo.readyState === 0) {
                heroVideo.load();
            }
        }
    }
    
    // Start video setup
    setupVideoHandling();
    
    // Handle switch click
    preloaderSwitch.addEventListener('change', function() {
        if (this.checked) {
            // Small delay for switch animation
            setTimeout(() => {
                if (videoReady && minimumTimeElapsed) {
                    transitionToHomepage();
                } else {
                    // Wait for conditions to be met
                    const checkInterval = setInterval(() => {
                        if (videoReady && minimumTimeElapsed) {
                            clearInterval(checkInterval);
                            transitionToHomepage();
                        }
                    }, 100);
                    
                    // Fallback - transition anyway after 4 seconds total
                    setTimeout(() => {
                        clearInterval(checkInterval);
                        transitionToHomepage();
                    }, 2000);
                }
            }, 600);
        }
    });
    
    // Transition function
    function transitionToHomepage() {
        // Mark as seen
        sessionStorage.setItem('nairoreelPreloaderSeen', 'true');
        
        // Start fade out
        preloaderOverlay.classList.add('preloader-hidden');
        
        // Show main content
        setTimeout(() => {
            document.body.classList.remove('preloader-active');
            // Ensure all content is visible
            document.querySelectorAll('body > *:not(.preloader-overlay)').forEach(el => {
                el.style.opacity = '1';
            });
        }, 500);
        
        // Remove preloader from DOM
        setTimeout(() => {
            preloaderOverlay.style.display = 'none';
        }, 1500);
    }
    
    // Mobile-specific video fix after page loads
    if (isMobile) {
        window.addEventListener('load', () => {
            const heroVideo = document.querySelector('.hero-video-bg video');
            if (heroVideo) {
                // Set attributes again to ensure they're applied
                heroVideo.setAttribute('playsinline', '');
                heroVideo.setAttribute('webkit-playsinline', '');
                heroVideo.setAttribute('x5-playsinline', '');
                heroVideo.setAttribute('x5-video-player-type', 'h5');
                heroVideo.setAttribute('x5-video-player-fullscreen', 'false');
                heroVideo.muted = true;
                heroVideo.defaultMuted = true;
                heroVideo.autoplay = true;
                
                // Try to play again after page fully loads
                setTimeout(() => {
                    heroVideo.play().catch(e => {
                        console.log('Mobile video playback requires user interaction');
                    });
                }, 100);
            }
        });
    }
    
})();