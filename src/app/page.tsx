// import { getPageInfo, getPostInfo } from "@/lib/wp";

export default async function Home() {
  
  // const { title, content } = await getPostInfo(43)
  // console.log({title});
  

  return (
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        {/* <h1>{title}</h1>
        <div dangerouslySetInnerHTML={{ __html: content }}></div> */}
      </main>
  );
}



