// utils/formatFaqs.ts
export type FaqItem = {
  question: string;
  answer: string;
};

export type FaqsResponse = {
  display_title: string;
  faqs: FaqItem[];
};

/**
 * Recibe un objeto 'acf' desde WordPress y devuelve
 * { display_title, faqs: [] } en formato array.
 */
export function formatFaqs(acf: any): FaqsResponse {
  const faqsArray: FaqItem[] = [];

//   console.log(acf.faq);
  

  if (acf?.faq) {
    Object.values(acf.faq).forEach((item: any) => {
      if (item?.question && item?.answer) {
        faqsArray.push({
          question: item.question,
          answer: item.answer,
        });
      }
    });
  }

  return {
    display_title: acf?.display_title || '',
    faqs: faqsArray,
  };
}
