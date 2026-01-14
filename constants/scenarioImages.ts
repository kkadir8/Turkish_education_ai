// Senaryo Görselleri - Unsplash'ten seçilmiş Türkiye ve kültür temalı görseller
// DALL-E maliyetini sıfırlamak için sabit görsel seti

export const SCENARIO_IMAGES = [
    {
        id: 1,
        url: "/images/scenarios/istanbul.jpg",
        description: "İstanbul Boğazı, denizde vapurlar ve uçan martılar."
    },
    {
        id: 2,
        url: "/images/scenarios/kapadokya.jpg",
        description: "Kapadokya'da gökyüzünde uçan renkli balonlar ve peri bacaları."
    },
    {
        id: 3,
        url: "/images/scenarios/cay_simit.jpg",
        description: "İnce belli bardakta Türk çayı ve yanında simit."
    },
    {
        id: 4,
        url: "/images/scenarios/kedi.jpg",
        description: "Sokakta oturan sevimli bir kedi."
    },
    {
        id: 5,
        url: "/images/scenarios/kahve.jpg",
        description: "Türk kahvesi fincanı ve yanında lokum."
    },
    {
        id: 6,
        url: "/images/scenarios/alisveris.jpg",
        description: "Alışveriş yapan insanlar ve kıyafet dükkanları."
    }
];

// Helper: Rastgele bir görsel seç
export const getRandomScenarioImage = () => {
    const randomIndex = Math.floor(Math.random() * SCENARIO_IMAGES.length);
    return SCENARIO_IMAGES[randomIndex];
};

// Helper: ID ile görsel bul
export const getScenarioImageById = (id: number) => {
    return SCENARIO_IMAGES.find(img => img.id === id);
};
