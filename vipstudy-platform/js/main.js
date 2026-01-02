  // New Cartoon Intro Animation
        window.addEventListener('load', function() {
            const introProgressBar = document.getElementById('introProgressBar');
            const introScreen = document.getElementById('intro-screen');
            const mainContent = document.getElementById('main-content');
            
            let progress = 0;
            const introInterval = setInterval(() => {
                progress += 2;
                introProgressBar.style.width = progress + '%';
                
                if (progress >= 100) {
                    clearInterval(introInterval);
                    setTimeout(() => {
                        introScreen.classList.add('hidden');
                        setTimeout(() => {
                            mainContent.classList.add('visible');
                            loadFavorites();
                            updateStats();
                        }, 300);
                    }, 500);
                }
            }, 40); // Faster progress for better experience
        });

        // Batch Selection Modal Variables
        const batchModal = document.getElementById('batchModal');
        const modalClose = document.getElementById('modalClose');
        const selectedBatchTitle = document.getElementById('selectedBatchTitle');
        const selectedBatchPrice = document.getElementById('selectedBatchPrice');
        const batchLinkOption = document.getElementById('batchLinkOption');
        
        // Telegram Group Links for each batch
        const telegramGroups = {
            "निर्माण Batch Railway General Science Foundation Course 2025": "https://t.me/+roQAmujl1TRjMjE1",
            "Basic Science & Engineering  2024 (Recorded)": "https://t.me/+roQAmujl1TRjMjE1",
            " RRB JE Mechanical Umang Batch": "https://t.me/+roQAmujl1TRjMjE1",
            
        };

        // Show Batch Selection Modal
        function showBatchModal(card) {
            const title = card.getAttribute('data-title');
            const price = card.getAttribute('data-price');
            const batchLink = card.getAttribute('data-link');
            
            // Update modal content
            selectedBatchTitle.textContent = title;
            selectedBatchPrice.textContent = `${price} • Lifetime Access`;
            
            // Set Telegram link for this batch
            const telegramOption = document.getElementById('telegramOption');
            telegramOption.href = telegramGroups[title] || "https://t.me/rgvikramjeet";
            
            // Set batch link
            batchLinkOption.href = batchLink;
            
            // Show modal
            batchModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        // Close Batch Modal
        function closeBatchModal() {
            batchModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }

        // Timer
        let minutes = 0;
        let hours = 0;
        setInterval(() => {
            minutes++;
            if (minutes >= 60) {
                hours++;
                minutes = 0;
            }
            document.getElementById('timer').textContent = `${hours}h ${minutes}m`;
        }, 60000);

        // Search Functionality
        const searchBox = document.getElementById('searchBox');
        const courseCards = document.querySelectorAll('.course-card');
        const emptyState = document.getElementById('emptyState');

        searchBox.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase().trim();
            let visibleCount = 0;
            
            courseCards.forEach(card => {
                const title = card.getAttribute('data-title').toLowerCase();
                const category = card.getAttribute('data-category');
                const isFavorite = card.querySelector('.favorite-btn').classList.contains('favorited');
                
                // Check if card matches search term
                const matchesSearch = title.includes(searchTerm);
                
                // Check if card matches current filter
                const currentFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
                const matchesFilter = currentFilter === 'all' || 
                                     (currentFilter === 'favorite' && isFavorite) ||
                                     (currentFilter !== 'favorite' && category === currentFilter);
                
                if (matchesSearch && matchesFilter) {
                    card.classList.remove('hidden');
                    visibleCount++;
                } else {
                    card.classList.add('hidden');
                }
            });
            
            // Show/hide empty state
            if (visibleCount === 0 && searchTerm.length > 0) {
                emptyState.classList.add('visible');
            } else {
                emptyState.classList.remove('visible');
            }
        });

        // Filter Functionality
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                
                // Trigger search to update filtered results
                searchBox.dispatchEvent(new Event('input'));
            });
        });

        // Favorite Functionality
        let favorites = {};

        function toggleFavorite(btn) {
            const card = btn.closest('.course-card');
            const title = card.getAttribute('data-title');
            
            if (btn.classList.contains('favorited')) {
                btn.classList.remove('favorited');
                btn.textContent = '♡';
                delete favorites[title];
            } else {
                btn.classList.add('favorited');
                btn.textContent = '♥';
                favorites[title] = true;
            }
            
            saveFavorites();
            updateStats();
            
            // If we're on favorite filter, update display
            if (document.querySelector('.filter-btn.active').getAttribute('data-filter') === 'favorite') {
                searchBox.dispatchEvent(new Event('input'));
            }
            
            // Stop event propagation to prevent card click
            event.stopPropagation();
        }

        function saveFavorites() {
            const favArray = Object.keys(favorites);
            // Save to localStorage for persistence
            localStorage.setItem('rgFavorites', JSON.stringify(favArray));
        }

        function loadFavorites() {
            const savedFavorites = localStorage.getItem('rgFavorites');
            if (savedFavorites) {
                const favArray = JSON.parse(savedFavorites);
                favArray.forEach(title => {
                    favorites[title] = true;
                    const card = document.querySelector(`[data-title="${title}"]`);
                    if (card) {
                        const btn = card.querySelector('.favorite-btn');
                        btn.classList.add('favorited');
                        btn.textContent = '♥';
                    }
                });
            }
        }

        // Stats Update
        function updateStats() {
            const favoriteCount = Object.keys(favorites).length;
            document.getElementById('favoriteCount').textContent = favoriteCount;
        }

        // Menu Button Interaction
        document.getElementById('menuBtn').addEventListener('click', function() {
            alert('Menu coming soon! Stay tuned for new features update.');
        });

        // Course Card Click Handler - Show Batch Selection Modal
        courseCards.forEach(card => {
            card.addEventListener('click', function(e) {
                // Don't trigger if clicking favorite button
                if (!e.target.closest('.favorite-btn')) {
                    showBatchModal(this);
                }
            });
        });

        // Close Modal Events
        modalClose.addEventListener('click', closeBatchModal);
        
        // Close modal when clicking outside
        batchModal.addEventListener('click', function(e) {
            if (e.target === batchModal) {
                closeBatchModal();
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && batchModal.classList.contains('active')) {
                closeBatchModal();
            }
        });

        // Prevent batch link from closing modal immediately
        batchLinkOption.addEventListener('click', function(e) {
            // Allow link to open in new tab
            this.target = '_blank';
        });

        // Initial stats update
        updateStats();