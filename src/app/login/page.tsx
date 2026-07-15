import Image from "next/image";
import LoginButton from "@/components/Login/LoginButton";


export default function Home() {
  return (
    <main className="flex pt-16 h-screen flex-col flex-1 items-center justify-center font-sans dark:bg-black bg-[url('/images/page-backgrounds/dark-starry-sky.jpg')] bg-cover bg-center bg-no-repeat">
    

      <div className="flex border border-[#fff48e] rounded-lg flex-1 min-w-0 flex-1 h-auto max-h-[50vh] flex-col items-center justify-center py-18 px-16 bg-white dark:bg-black">
        <div className="flex flex-col items-center text-lg text-center justify-center mb-8 sm:items-start">
          To submit new content to the site you need an account, please log in.
        </div>
        <LoginButton />
      </div>
    

    </main>
  );
}