function getRandomHexColor() {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16); // Generate a random number and convert it to hex
    return `#${randomColor.padStart(6, '0')}`; // Ensure the hex value is 6 digits
  }
  
  export default getRandomHexColor;