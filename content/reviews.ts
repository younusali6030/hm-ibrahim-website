/**
 * Real Google reviews only. Never invent or paraphrase a review.
 * Fill this list by copying reviews from the shop's Google Maps listing, word for word.
 * While the list is empty, the homepage shows a link to the Google listing instead of a wall.
 */
export type GoogleReview = {
  author: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  /** e.g. "2 months ago" or "March 2026", exactly as Google shows it */
  when?: string;
};

/** Pulled from the shop's Google listing (cid 13885147699571790648). Text is verbatim. */
export const googleReviews: GoogleReview[] = [
  {
    author: "Sunil Makasre",
    rating: 5,
    when: "July 2026",
    text:
      "I have been purchasing various type of wiremesh products from this shop since 5 years. A great shop with huge variety.\nThe behavior is great and the staff is also helpful. They cater all our needs.\nThey also deal in wire rope and all type of GI & MS wire.",
  },
  {
    author: "Aziz Barwaniwala",
    rating: 5,
    when: "December 2025",
    text:
      "HM Ibrahim & Co. offers top-quality hardware equipment, from basic nails to heavy-duty barbed wire. GI wire is consistently available, and Tata wire is always in stock through their partners. Delivery was smooth across Indore and nearby districts, and they appear to have PAN-India reach as well.",
  },
  {
    author: "METAWELD ENGINEERING",
    rating: 5,
    when: "April 2026",
    text:
      "Purchased wiremesh jali ,/ weldmesh jali for my factory & machine. Great price with best quality from the market.\nNice shop with huge variety",
  },
  {
    author: "Rehan khan",
    rating: 5,
    when: "May 2026",
    text:
      "I got what I was looking for. It took me half an hour in the market but no shop has the variety which this shop has. All types of wiremesh (jaali) is available with them.\nGreat shop and good behaviour with reasonable price.\n5 / 5 stars",
  },
  {
    author: "Rupendra Bodul",
    rating: 5,
    when: "February 2026",
    text:
      "I am an artist.\nI was looking for wiremesh (jali) for my art work. I found exactly what I was looking for. Huge shop with huge variety of jali's. Must visit even interior designers for their needs.\nThe owner was really helpful & understood my needs.",
  },
  {
    author: "Sanjeev Kingar",
    rating: 4,
    when: "November 2025",
    text:
      "One stop destination for all types of construction related articles in Siyaganj, Indore. Having a legacy of more than 70 years, the third generation of this shop makes sure the quality and service is never compromised. I have almost every time found my requirements at a fair price. Highly recommend this place to all who have such construction related requirements",
  },
];

/** Rating breakdown from the same listing, 633 reviews in total. */
export const ratingBreakdown = { 5: 603, 4: 19, 3: 3, 2: 2, 1: 6 } as const;
