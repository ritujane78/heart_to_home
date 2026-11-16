
function NamasteIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1000 1000"
      width="44"
      height="44"
      fill="none"
      stroke="currentColor"
      strokeWidth="15"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="Namaste hands"
      className="text-[#1f6f5c] transition-colors duration-200 hover:text-[#073b2e]"
    >
      {/* Left hand */}
      <path d="
        M490 160 C460 195 440 275 415 340
        L390 410 C375 460 390 530 405 580
        L315 675 C295 655 270 650 250 670
        C230 690 245 730 270 755 L350 810
        C380 830 410 820 435 795 L475 750
        C490 725 490 690 490 650 Z
      " />

      {/* Right hand */}
      <path d="
        M490 160 C525 195 555 275 585 340
        L610 410 C625 460 610 530 595 580
        L685 675 C705 655 730 650 750 670
        C770 690 755 730 730 755 L650 810
        C620 830 590 820 565 795 L525 750
        C510 725 490 690 490 650 Z
      " />

      {/* Joined palms */}
      <path d="M490 165 L490 595" />
      <path d="M490 230 C465 245 450 290 440 355" />
      <path d="M490 230 C515 245 530 290 540 355" />

      {/* Finger details */}
      <path d="M490 165 L490 230" />
      <path d="M490 230 L490 595" />

      {/* Left wrist and bracelet */}
      <path d="
        M315 675 C285 660 260 675 265 710
        C270 750 305 780 345 785
        C380 790 405 770 420 740
      " />
      <path d="
        M280 700 C290 735 315 755 350 765
        C380 775 400 755 410 735
      " />
      <path d="M300 730 C315 755 340 765 365 765" />

      {/* Right wrist and bracelet */}
      <path d="
        M685 675 C715 660 740 675 735 710
        C730 750 695 780 655 785
        C620 790 595 770 580 740
      " />
      <path d="
        M720 700 C710 735 685 755 650 765
        C620 775 600 755 590 735
      " />
      <path d="M700 730 C685 755 660 765 635 765" />

      {/* Bracelet decorations */}
      <path d="M350 810 L330 845" />
      <path d="M375 815 C380 840 365 850 365 865" />
      <path d="M400 805 L405 845" />

      <path d="M630 810 L650 845" />
      <path d="M605 815 C600 840 615 850 615 865" />
      <path d="M580 805 L575 845" />

      {/* Tassels */}
      <path
        d="M365 850 C350 875 355 890 375 895 C395 890 395 875 380 850 Z"
        fill="currentColor"
        stroke="none"
      />
      <path
        d="M615 850 C630 875 625 890 605 895 C585 890 585 875 600 850 Z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

export default NamasteIcon;