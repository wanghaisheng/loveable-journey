document.addEventListener('DOMContentLoaded', function() {
    // Additional tips data
    const additionalTips = [
        "Break complex requirements into smaller, focused prompts to get more precise results from Loveable.dev.",
        "When describing UI components, be specific about interactions and state changes to reduce the need for revisions.",
        "Include example code snippets in your requirements when you want Loveable to follow specific patterns or conventions.",
        "For complex data visualization requirements, create simple diagrams or mockups to supplement your text descriptions.",
        "Track which prompts consume more credits and optimize them for efficiency in future projects.",
        "When possible, use progressive enhancement - start with a basic version and iterate with more specific requirements.",
        "Maintain a 'prompt library' of effective instructions that produced good results for reuse in similar projects.",
        "Consider time of day for your Loveable sessions - sometimes the system performs better during off-peak hours."
    ];

    // Modal functionality
    const modal = document.getElementById("tipModal");
    const btn = document.getElementById("showTipsBtn");
    const span = document.getElementsByClassName("close")[0];
    const tipsList = document.getElementById("tipsList");

    // Show modal when button is clicked
    btn.onclick = function() {
        // Populate tips list
        tipsList.innerHTML = '';
        additionalTips.forEach(tip => {
            const li = document.createElement('li');
            li.textContent = tip;
            tipsList.appendChild(li);
        });
        
        modal.style.display = "block";
    }

    // Close modal when X is clicked
    span.onclick = function() {
        modal.style.display = "none";
    }

    // Close modal when clicking outside of it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Intersection Observer for card animations
    const cards = document.querySelectorAll('.strategy-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    cards.forEach(card => {
        card.style.opacity = 0;
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });

    // Add metadata for SEO
    const metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
        const meta = document.createElement('meta');
        meta.name = "description";
        meta.content = "Learn the most effective strategies for using Loveable.dev from someone who spent 100 credits in just 3 days. Discover how to maximize AI-assisted development.";
        document.head.appendChild(meta);
    }

    // Load markdown content from files
    async function loadMarkdownContent() {
        try {
            // Load React + i18n prompt
            const reactI18nResponse = await fetch('/prompts/React-Mock-i18n.md');
            const reactI18nContent = await reactI18nResponse.text();
            document.getElementById('react-i18n').textContent = reactI18nContent;

            // Load page best practices prompt
            const pageBestPracticesResponse = await fetch('/prompts/page-best-practise.md');
            const pageBestPracticesContent = await pageBestPracticesResponse.text();
            document.getElementById('data-layout').textContent = pageBestPracticesContent;

            // Initialize preview content (first 100 characters)
            const previewLength = 100;
            
            // Update existing previews
            const previewElements = document.querySelectorAll('.prompt-preview');
            if (previewElements.length > 0) {
                previewElements[0].textContent = reactI18nContent.substring(0, previewLength) + '...';
            }
            if (previewElements.length > 1) {
                previewElements[1].textContent = pageBestPracticesContent.substring(0, previewLength) + '...';
            }
        } catch (error) {
            console.error('Error loading markdown content:', error);
            // Fallback to hardcoded content if loading fails
            document.getElementById('react-i18n').textContent = 'Error loading content. Please try again later.';
            document.getElementById('data-layout').textContent = 'Error loading content. Please try again later.';
        }
    }

    // Call the function to load markdown content
    loadMarkdownContent();
    
    // Handle expand button clicks
    const expandButtons = document.querySelectorAll('.expand-btn');
    expandButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.parentElement;
            const content = card.querySelector('.prompt-content');
            
            if (content.classList.contains('expanded')) {
                content.classList.remove('expanded');
                this.textContent = 'View Full Prompt';
            } else {
                content.classList.add('expanded');
                this.textContent = 'Hide Full Prompt';
            }
        });
    });
    
    // Handle copy button clicks
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const promptId = this.getAttribute('data-prompt-id');
            const textToCopy = document.getElementById(promptId).textContent;
            
            navigator.clipboard.writeText(textToCopy).then(() => {
                const icon = this.querySelector('i');
                icon.classList.remove('fa-copy');
                icon.classList.add('fa-check');
                icon.classList.add('copy-success');
                
                setTimeout(() => {
                    icon.classList.remove('fa-check');
                    icon.classList.remove('copy-success');
                    icon.classList.add('fa-copy');
                }, 2000);
            });
        });
    });
    
    // Handle View All Prompts button
    const viewAllBtn = document.getElementById('viewAllPromptsBtn');
    viewAllBtn.addEventListener('click', function() {
        const allPromptCards = document.querySelectorAll('.prompt-card');
        const allPromptContents = document.querySelectorAll('.prompt-content');
        const allExpandBtns = document.querySelectorAll('.expand-btn');
        
        if (this.textContent === 'View All Prompts') {
            allPromptContents.forEach(content => {
                content.classList.add('expanded');
            });
            allExpandBtns.forEach(btn => {
                btn.textContent = 'Hide Full Prompt';
            });
            this.textContent = 'Collapse All Prompts';
        } else {
            allPromptContents.forEach(content => {
                content.classList.remove('expanded');
            });
            allExpandBtns.forEach(btn => {
                btn.textContent = 'View Full Prompt';
            });
            this.textContent = 'View All Prompts';
        }
    });

    /* @tweakable footer link animation duration in milliseconds */
    const footerLinkAnimationDuration = 300;
    
    // Add hover effect to footer GitHub link
    const footerLink = document.querySelector('.footer-link');
    if (footerLink) {
        footerLink.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.github-icon');
            icon.style.transition = `transform ${footerLinkAnimationDuration}ms ease`;
            icon.style.transform = 'rotate(360deg) scale(1.2)';
        });
        
        footerLink.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.github-icon');
            icon.style.transform = 'rotate(0) scale(1)';
        });
    }
});