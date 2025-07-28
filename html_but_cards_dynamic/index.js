const buildCard = (defaultCards) => {
    var allCards = [];
    // Create a card element with dynamic content
    for (const cardData of defaultCards) {
        const card = document.createElement("article");
        card.className = "card";
        card.style.setProperty("--swipe-x", "0px");
        card.style.setProperty("--swipe-rotate", "0deg");

        const cardContent = document.createElement("div");
        cardContent.className = "card-content";

        const image = document.createElement("img");
        image.src = cardData.image;
        image.alt = "";

        const title = document.createElement("h3");
        title.className = "card-title";
        title.textContent = cardData.title;

        const description = document.createElement("p");
        description.textContent = cardData.description;

        cardContent.appendChild(image);
        cardContent.appendChild(title);
        cardContent.appendChild(description);
        card.appendChild(cardContent);

        allCards.push(card);
    }
    return allCards;
};

document.addEventListener("DOMContentLoaded", () => {
    const defaultCards = [
        {
            title: "Snoop Me",
            description: "Peek into the shadows of the internet and see what we found lurking. You won’t believe item #3.",
            image: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NTIxNjg1ODF8&ixlib=rb-4.1.0&q=85",
        },
        {
            title: "Data Dive",
            description: "Explore beautifully chaotic numbers transformed into visuals that even your grandma could love.",
            image: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NTIxNjg1ODF8&ixlib=rb-4.1.0&q=85",
        },
        {
            title: "Pixel Playground",
            description: "Where creativity meets code. Drag, drop, or destroy—it’s your sandbox now.",
            image: "https://images.unsplash.com/photo-1457305237443-44c3d5a30b89?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NTIxNjg4Mjl8&ixlib=rb-4.1.0&q=85",
        },
        {
            title: "404 Adventures",
            description: "Not all who wander are lost. But this card? It’s been places your browser can’t handle.",
            image: "https://images.unsplash.com/photo-1594322436404-5a0526db4d13?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NTIxNjg4NjR8&ixlib=rb-4.1.0&q=85",
        },
        {
            title: "Midnight Release",
            description: "The latest features, hottest bugs, and questionable design choices—all rolled into one update.",
            image: "https://images.unsplash.com/photo-1485356824219-4bc17c2a2ea7?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NTIxNjg5MTF8&ixlib=rb-4.1.0&q=85",
        },
        {
            title: "Glitch Gallery",
            description: "A curated mess of digital art gone wrong (or very right). Expect the unexpected.",
            image: "https://images.unsplash.com/photo-1580796726313-7b2861e4a38b?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NTIxNjg5NDF8&ixlib=rb-4.1.0&q=85",
        },
        {
            title:"Peter Herrmann",
            description:"Image by Peter Herrmann",
            image: "https://images.unsplash.com/photo-1753550639305-92c17f3532db?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        }
    ];

    const cardStack = document.querySelector(".card-stack");
    let cards = buildCard(defaultCards);
    if (!cardStack) {
        console.error("Card stack element not found.");
        return;
    }

    cards.forEach((card) => cardStack.appendChild(card));

    let isSwiping = false;
    let startX = 0;
    let currentX = 0;
    let animationFrameId = null;

    const getDurationFromCSS = (variableName, element = document.documentElement) => {
        const value = getComputedStyle(element)?.getPropertyValue(variableName)?.trim();
        if (!value) return 0;
        if (value.endsWith("ms")) return parseFloat(value);
        if (value.endsWith("s")) return parseFloat(value) * 1000;
        return parseFloat(value) || 0;
    };

    const getActiveCard = () => cards[0];

    const updatePositions = () => {
        cards.forEach((card, i) => {
            card.style.setProperty("--i", i + 1);
            card.style.setProperty("--swipe-x", "0px");
            card.style.setProperty("--swipe-rotate", "0deg");
            card.style.opacity = "1";
        });
    };

    const applySwipeStyles = (deltaX) => {
        const card = getActiveCard();
        if (!card) return;
        card.style.setProperty("--swipe-x", `${deltaX}px`);
        card.style.setProperty("--swipe-rotate", `${deltaX * 0.2}deg`);
        card.style.opacity = 1 - Math.min(Math.abs(deltaX) / 100, 1) * 0.75;
    };

    const handleStart = (clientX) => {
        if (isSwiping) return;
        isSwiping = true;
        startX = currentX = clientX;
        const card = getActiveCard();
        card && (card.style.transition = "none");
    };

    const handleMove = (clientX) => {
        if (!isSwiping) return;
        cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(() => {
            currentX = clientX;
            const deltaX = currentX - startX;
            applySwipeStyles(deltaX);

            if (Math.abs(deltaX) > 50) handleEnd();
        });
    };

    const handleEnd = () => {
        if (!isSwiping) return;
        cancelAnimationFrame(animationFrameId);

        const deltaX = currentX - startX;
        const threshold = 50;
        const duration = getDurationFromCSS("--card-swap-duration");
        const card = getActiveCard();

        if (card) {
            card.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`;

            if (Math.abs(deltaX) > threshold) {
                const direction = Math.sign(deltaX);

                card.style.setProperty("--swipe-x", `${direction * 300}px`);
                card.style.setProperty("--swipe-rotate", `${direction * 20}deg`);

                setTimeout(() => {
                    card.style.setProperty("--swipe-rotate", `${-direction * 20}deg`);
                }, duration * 0.5);

                setTimeout(() => {
                    cards = [...cards.slice(1), card];
                    updatePositions();
                }, duration);
            } else {
                applySwipeStyles(0);
            }
        }

        isSwiping = false;
        startX = currentX = 0;
    };

    const addEventListeners = () => {
        cardStack?.addEventListener("pointerdown", ({ clientX }) => handleStart(clientX));
        cardStack?.addEventListener("pointermove", ({ clientX }) => handleMove(clientX));
        cardStack?.addEventListener("pointerup", handleEnd);
    };

    updatePositions();
    addEventListeners();
});
