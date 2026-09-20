/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const menuButton = document.querySelector(".menu-button");
const mobileMenu = document.querySelector(".mobile-menu");
const mobileMenuLinks = document.querySelectorAll(".mobile-menu a");

const scrollProgress = document.getElementById("scroll-progress");

const revealElements = document.querySelectorAll(".reveal");

const sections = document.querySelectorAll("main section, body > section");

const navLinks = document.querySelectorAll(".nav-links a");


/* =========================================================
   MOBILE MENU
   ========================================================= */

if (menuButton && mobileMenu) {

    menuButton.addEventListener("click", () => {

        mobileMenu.classList.toggle("active");

        const isOpen = mobileMenu.classList.contains("active");

        menuButton.setAttribute("aria-expanded", isOpen);

        menuButton.setAttribute(
            "aria-label",
            isOpen ? "Đóng menu" : "Mở menu"
        );

    });

}


/* =========================================================
   CLOSE MOBILE MENU AFTER CLICKING A LINK
   ========================================================= */

mobileMenuLinks.forEach(link => {

    link.addEventListener("click", () => {

        if (!mobileMenu) return;

        mobileMenu.classList.remove("active");

        if (menuButton) {

            menuButton.setAttribute("aria-expanded", "false");

            menuButton.setAttribute(
                "aria-label",
                "Mở menu"
            );

        }

    });

});


/* =========================================================
   CLOSE MOBILE MENU WHEN CLICKING OUTSIDE
   ========================================================= */

document.addEventListener("click", event => {

    if (!mobileMenu || !menuButton) return;

    const clickedInsideMenu =
        mobileMenu.contains(event.target);

    const clickedButton =
        menuButton.contains(event.target);

    if (
        mobileMenu.classList.contains("active") &&
        !clickedInsideMenu &&
        !clickedButton
    ) {

        mobileMenu.classList.remove("active");

        menuButton.setAttribute("aria-expanded", "false");

        menuButton.setAttribute(
            "aria-label",
            "Mở menu"
        );

    }

});


/* =========================================================
   SCROLL REVEAL
   ========================================================= */

const revealObserver = new IntersectionObserver(
    entries => {

        entries.forEach(entry => {

            if (!entry.isIntersecting) return;

            entry.target.classList.add("visible");

            /*
             * Animation only happens once.
             */

            revealObserver.unobserve(entry.target);

        });

    },
    {
        threshold: 0.12,
        rootMargin: "0px 0px -50px 0px"
    }
);


revealElements.forEach(element => {

    revealObserver.observe(element);

});


/* =========================================================
   TIMELINE ACCORDION
   ========================================================= */

const timelineEvents =
    document.querySelectorAll(".timeline-event");


timelineEvents.forEach(event => {

    const card = event.querySelector(".timeline-card");

    if (!card) return;


    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-expanded", "false");


    function toggleEvent() {

        const isCurrentlyActive =
            event.classList.contains("active");


        /*
         * Close every other event.
         */

        timelineEvents.forEach(otherEvent => {

            if (otherEvent !== event) {

                otherEvent.classList.remove("active");

                const otherCard =
                    otherEvent.querySelector(".timeline-card");

                if (otherCard) {

                    otherCard.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }

            }

        });


        /*
         * Toggle the selected event.
         */

        if (isCurrentlyActive) {

            event.classList.remove("active");

            card.setAttribute(
                "aria-expanded",
                "false"
            );

        } else {

            event.classList.add("active");

            card.setAttribute(
                "aria-expanded",
                "true"
            );

        }

    }


    card.addEventListener("click", toggleEvent);


    /*
     * Keyboard accessibility:
     * Enter or Space opens the event.
     */

    card.addEventListener("keydown", event => {

        if (
            event.key === "Enter" ||
            event.key === " "
        ) {

            event.preventDefault();

            toggleEvent();

        }

    });

});


/* =========================================================
   SMOOTH NAVIGATION
   ========================================================= */

document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", event => {

        const targetID =
            link.getAttribute("href");

        if (!targetID || targetID === "#") return;

        const target =
            document.querySelector(targetID);

        if (!target) return;

        event.preventDefault();

        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    });

});


/* =========================================================
   ACTIVE NAVIGATION
   ========================================================= */

const navigationSections = [
    {
        id: "hero",
        link: document.querySelector(
            '.nav-links a[href="#hero"]'
        )
    },
    {
        id: "gioithieu",
        link: document.querySelector(
            '.nav-links a[href="#gioithieu"]'
        )
    },
    {
        id: "timeline",
        link: document.querySelector(
            '.nav-links a[href="#timeline"]'
        )
    },
    {
        id: "ynghia",
        link: document.querySelector(
            '.nav-links a[href="#ynghia"]'
        )
    },
    {
        id: "ketluan",
        link: document.querySelector(
            '.nav-links a[href="#ketluan"]'
        )
    }
];


const activeSectionObserver =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) return;

                const sectionID =
                    entry.target.id;

                navigationSections.forEach(item => {

                    if (!item.link) return;

                    item.link.classList.toggle(
                        "active",
                        item.id === sectionID
                    );

                });

            });

        },
        {
            rootMargin: "-35% 0px -55% 0px",
            threshold: 0
        }
    );


navigationSections.forEach(item => {

    const section =
        document.getElementById(item.id);

    if (section) {

        activeSectionObserver.observe(section);

    }

});


/* =========================================================
   SCROLL PROGRESS
   ========================================================= */

function updateScrollProgress() {

    if (!scrollProgress) return;

    const scrollTop =
        window.scrollY;

    const documentHeight =
        document.documentElement.scrollHeight -
        window.innerHeight;

    if (documentHeight <= 0) {

        scrollProgress.style.width = "0%";

        return;

    }

    const progress =
        (scrollTop / documentHeight) * 100;

    scrollProgress.style.width =
        `${Math.min(progress, 100)}%`;

}


/*
 * requestAnimationFrame prevents unnecessary
 * layout calculations during scrolling.
 */

let progressTicking = false;

window.addEventListener(
    "scroll",
    () => {

        if (!progressTicking) {

            window.requestAnimationFrame(() => {

                updateScrollProgress();

                progressTicking = false;

            });

            progressTicking = true;

        }

    },
    {
        passive: true
    }
);


/* =========================================================
   IMAGE LAZY LOADING
   ========================================================= */

const images =
    document.querySelectorAll("img");


images.forEach(image => {

    /*
     * Only add loading="lazy" to images
     * that are not the hero background.
     */

    if (!image.hasAttribute("loading")) {

        image.setAttribute(
            "loading",
            "lazy"
        );

    }

});


/* =========================================================
   HEADER SHADOW ON SCROLL
   ========================================================= */

const header =
    document.getElementById("header");


function updateHeader() {

    if (!header) return;

    if (window.scrollY > 30) {

        header.style.boxShadow =
            "0 5px 25px rgba(18, 52, 88, 0.10)";

    } else {

        header.style.boxShadow = "none";

    }

}


let headerTicking = false;

window.addEventListener(
    "scroll",
    () => {

        if (!headerTicking) {

            window.requestAnimationFrame(() => {

                updateHeader();

                headerTicking = false;

            });

            headerTicking = true;

        }

    },
    {
        passive: true
    }
);


/* =========================================================
   INITIAL STATE
   ========================================================= */

updateScrollProgress();
updateHeader();
