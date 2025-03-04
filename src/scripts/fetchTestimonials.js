/**
 * Script to fetch random users from RandomUser API and generate testimonials
 * Run with: node src/scripts/fetchTestimonials.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Credit repair testimonial templates
const testimonialTemplates = [
  "After struggling with debt for years, I saw my credit score jump {score} points in just {months} months with Mulligan's help. Now I'm pre-approved for my first home!",
  "They removed {count} incorrect late payments from my report that had been dragging my score down for years. My auto loan rate dropped by {percent}% when I refinanced!",
  "As a small business owner, I needed good credit to expand. Mulligan helped me dispute outdated information and my score increased by {score} points.",
  "After my divorce, my credit was in shambles. Within {months} months of working with Mulligan, I qualified for a new apartment and credit card with favorable terms.",
  "They helped me remove a bankruptcy that wasn't mine! My score jumped from {lowScore} to {highScore} in just {months} months. I'm forever grateful.",
  "I had medical bills in collections that weren't my responsibility. Mulligan helped me dispute them all and my score improved by {score} points.",
  "After identity theft damaged my credit, Mulligan helped me clean up my report. Within {months} months, all fraudulent accounts were removed and my score increased by {score} points.",
  "I was denied a mortgage due to errors on my credit report. Mulligan helped me identify and dispute them all. Now I'm moving into my dream home next month!",
  "As a recent graduate with student loans, I was worried about my financial future. Mulligan helped me establish good credit habits and dispute errors, raising my score by {score} points.",
  "After years of financial struggles, Mulligan helped me remove outdated collections and negotiate with creditors. My score went from {lowScore} to {highScore} in just {months} months."
];

// Function to generate a random number within a range
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to fill in the template placeholders with random values
function generateTestimonial(template) {
  return template
    .replace('{score}', getRandomNumber(70, 150))
    .replace('{months}', getRandomNumber(2, 8))
    .replace('{count}', getRandomNumber(3, 12))
    .replace('{percent}', getRandomNumber(2, 6))
    .replace('{lowScore}', getRandomNumber(450, 580))
    .replace('{highScore}', getRandomNumber(680, 800));
}

// Fetch 10 random users from the RandomUser API
function fetchRandomUsers() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'randomuser.me',
      path: '/api?results=10',
      method: 'GET'
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const users = JSON.parse(data).results;
          resolve(users);
        } catch (error) {
          reject(new Error(`Failed to parse API response: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(new Error(`API request failed: ${error.message}`));
    });

    req.end();
  });
}

// Generate testimonials from the fetched users
async function generateTestimonials() {
  try {
    console.log('Fetching random users...');
    const users = await fetchRandomUsers();
    
    const testimonials = users.map((user, index) => {
      const firstName = user.name.first;
      const lastName = user.name.last.charAt(0);
      const fullName = `${firstName} ${lastName}`;
      const imageUrl = user.picture.large;
      const testimonialText = generateTestimonial(testimonialTemplates[index]);
      
      return {
        image: imageUrl,
        name: fullName,
        text: testimonialText
      };
    });

    // Format the testimonials as a TypeScript array
    const existingTestimonials = [
      {
        image: "/images/client-female-2.webp",
        name: "Jane D",
        text: "Increased her credit score by 120 points in just 60 days, allowing her to qualify for a mortgage with a competitive interest rate."
      },
      {
        image: "/images/client-male-1.webp",
        name: "Mike T",
        text: "Eliminated erroneous collections from his credit report, saving him over $10,000 in potential payments."
      }
    ];

    const allTestimonials = [...existingTestimonials, ...testimonials];
    
    const testimonialsCode = `import { Testimonial } from '@/components/sections/Testimonials';

/**
 * Testimonials data for the Testimonials section
 * Each testimonial includes an image URL, name, and text content
 */
export const testimonials: Testimonial[] = ${JSON.stringify(allTestimonials, null, 2)};
`;

    // Write the testimonials to the data file
    const filePath = path.join(__dirname, '../data/testimonials.ts');
    fs.writeFileSync(filePath, testimonialsCode);
    
    console.log(`Successfully generated ${testimonials.length} testimonials and saved to ${filePath}`);
  } catch (error) {
    console.error('Error generating testimonials:', error);
  }
}

// Execute the script
generateTestimonials();