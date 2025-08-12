import { getPageInfo } from "@/lib/wp";
// import Image from "next/image";

// async function getStaticProps() {
  
//   return {
//     props: {
//       title,
//       content
//     },
//     revalidate: 60,
//   }
// }

export default async function Home() {
  
  const { title, content } = await getPageInfo("sherpa-food-tours")
  console.log({title});
  

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1>{title}</h1>
        <p dangerouslySetInnerHTML={{ __html: content }}></p>
      </main>
    </div>
  );
}



