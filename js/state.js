const state = {
  playing: false,
  currentSong: 0,
  shuffle: false,
  repeat: 0,
  audio: new Audio(),
  favorites: [],
  songs: [
    {
      id: 0,
      title: "Donya (Remix)",
      artist: "Habib",
      imgSrc: "Habib-Donya.jpg",
      src: "Habib - Donya (Noyan Remix).mp3",
      isFavorite: false,
    },
    {
      id: 1,
      title: "Let me down slowly",
      artist: "Alec benjamin",
      imgSrc: "alec-slowly.jpg",
      src: "let-me-down-slowly.mp3",
      isFavorite: false,
    },
    {
      id: 2,
      title: "Khaterate To (unplugged)",
      artist: "Sirvan Khosravi",
      imgSrc: "sirvan-khaterate-to.jpg",
      src: "Sirvan-Khosravi-Khaterate-To-(Unplugged).mp3",
      isFavorite: false,
    },
    {
      id: 3,
      title: "Lovely (feat Khalid)",
      artist: "Billie Eilish",
      imgSrc: "billie-eilish.jpg",
      src: "Billie-Eilish-Khalid-lovely.mp3",
      isFavorite: false,
    },
  ],
};

export default state;
