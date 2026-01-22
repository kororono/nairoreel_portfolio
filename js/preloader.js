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

        // Start hero video on repeat visits
        document.addEventListener('DOMContentLoaded', () => {
            const heroVideo = document.querySelector('.hero-video-bg video');
            if (heroVideo) {
                heroVideo.play().catch(() => {
                    // Ignore autoplay errors
                });
            }
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
    
    // Video no longer needs to be ready before preloader exit
    // It will start playing AFTER preloader exits
    videoReady = true;
    
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

            // Start hero video playback after preloader exits
            const heroVideo = document.querySelector('.hero-video-bg video');
            if (heroVideo) {
                heroVideo.play().catch(() => {
                    // Ignore autoplay errors
                });
            }
        }, 500);

        // Remove preloader from DOM
        setTimeout(() => {
            preloaderOverlay.style.display = 'none';
        }, 1500);
    }
    
})();