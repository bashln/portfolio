document.addEventListener("DOMContentLoaded", () => {
  const terminalBlocks = document.querySelectorAll(".terminal-block");
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const speedPerChar = 0.04;
  const blockFadeInDuration = 0.5;
  const typemeBuffer = 0.5;
  const outputBuffer = 0.5;
  const outputFadeDuration = 1;
  const interBlockBuffer = 0.5;

  let currentDelay = 0;

  terminalBlocks.forEach((block, index) => {
    const typemeElement = block.querySelector(".typeme");
    const outputElement = block.querySelector(".output");
    const outputChildren = outputElement
      ? outputElement.querySelectorAll(":scope > *")
      : [];

    const fullCommandText = typemeElement.innerText;

    typemeElement.style.setProperty("--num-chars", fullCommandText.length);
    const typingSpeed = fullCommandText.length * speedPerChar;
    typemeElement.style.setProperty("--typing-speed", `${typingSpeed}s`);

    block.style.animationDelay = `${currentDelay}s`;

    const typemeStartDelay = currentDelay + blockFadeInDuration + typemeBuffer;
    typemeElement.style.animationDelay = `${typemeStartDelay}s`;

    const outputStartDelay = typemeStartDelay + typingSpeed + outputBuffer;
    outputElement.style.animationDelay = `${outputStartDelay}s`;

    outputChildren.forEach((child, childIndex) => {
      const childDelay = outputStartDelay + childIndex * 0.5;
      child.style.animationDelay = `${childDelay}s`;
    });

    currentDelay = outputStartDelay + outputFadeDuration + interBlockBuffer;

    setTimeout(
      () => {
        block.scrollIntoView({
          behavior: reduceMotion ? "auto" : "smooth",
          block: "end",
        });
      },
      currentDelay * 1000 - 500,
    );
  });
});
