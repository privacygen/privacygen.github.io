// Header functionality
document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('main-header');
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  
  // Create mobile menu
  const mobileMenu = document.createElement('div');
  mobileMenu.className = 'mobile-menu';
  
  // Clone navigation items for mobile menu
  const mainNav = document.querySelector('.main-nav');
  const navList = mainNav.querySelector('ul').cloneNode(true);
  mobileMenu.appendChild(navList);
  document.body.appendChild(mobileMenu);
  
  // Toggle mobile menu
  mobileMenuToggle.addEventListener('click', () => {
    document.body.classList.toggle('mobile-menu-active');
    mobileMenu.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');
  });
  
  // Handle scroll behavior for header
  let lastScrollTop = 0;
  
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 10) {
      header.style.boxShadow = 'var(--shadow-md)';
      header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
    } else {
      header.style.boxShadow = 'var(--shadow)';
      header.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
    }
    
    lastScrollTop = scrollTop;
  });

  // Handle navigation clicks
  const navLinks = document.querySelectorAll('.main-nav a, .mobile-menu a');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // Handle direct links (those without hash)
      if (!link.getAttribute('href').startsWith('#')) {
        return; // Let the default behavior handle direct links
      }

      e.preventDefault();
      const sectionId = link.getAttribute('href').substring(1);
      const section = document.getElementById(sectionId);
      
      if (section) {
        // Remove active class from all links
        navLinks.forEach(l => l.classList.remove('active'));
        // Add active class to clicked link
        link.classList.add('active');
        
        // Close mobile menu if open
        if (mobileMenu.classList.contains('active')) {
          document.body.classList.remove('mobile-menu-active');
          mobileMenu.classList.remove('active');
          mobileMenuToggle.classList.remove('active');
        }
        
        // Scroll to section
        const headerHeight = header.offsetHeight;
        const sectionTop = section.offsetTop - headerHeight;
        window.scrollTo({
          top: sectionTop,
          behavior: 'smooth'
        });
      }
    });

    // Add hover animation
    link.addEventListener('mouseenter', () => {
      link.style.transform = 'translateY(-2px)';
      link.style.transition = 'transform var(--transition-fast)';
    });
    
    link.addEventListener('mouseleave', () => {
      link.style.transform = 'translateY(0)';
    });
  });
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (
      mobileMenu.classList.contains('active') && 
      !mobileMenu.contains(e.target) && 
      !mobileMenuToggle.contains(e.target)
    ) {
      document.body.classList.remove('mobile-menu-active');
      mobileMenu.classList.remove('active');
      mobileMenuToggle.classList.remove('active');
    }
  });
  
  // Close mobile menu when window is resized to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768 && mobileMenu.classList.contains('active')) {
      document.body.classList.remove('mobile-menu-active');
      mobileMenu.classList.remove('active');
      mobileMenuToggle.classList.remove('active');
    }
  });

  // Update active menu item based on scroll position
  window.addEventListener('scroll', () => {
    // Only update active states if we're on the home page
    if (window.location.pathname === '/') {
      const scrollPosition = window.scrollY + header.offsetHeight + 100;
      const sections = document.querySelectorAll('section[id]');
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        const sectionId = section.id;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }
  });
});