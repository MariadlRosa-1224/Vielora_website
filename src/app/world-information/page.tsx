import Link from "next/dist/client/link";
import Image from "next/image";
import VerticalColorButton from "@/components/VerticalColorButton";


export default function Home() {
  return (
      <main className="min-h-screen bg-[#0D0F25] bg-[url('/images/page-backgrounds/dark-starry-sky.jpg')] bg-cover bg-center bg-no-repeat ">
<section className="relative max-h-[60vh] overflow-hidden bg-[#08091c] bg-[url('/images/world-information/library-wip.png')] bg-cover bg-center bg-no-repeat md:min-h-[60vh] mt-16">
    </section>


    {/* titulo y parrafo explicatorio */}
    <section className="relative min-h-[30vh] max-h-[100vh] flex justify-center md:min-h-[50vh] bg-[#0D0F25] py-10">

      
    <div className="relative min-w-[1048px] max-w-7xl mx-10">
        {/* Contenido de la sección */}
        <div className="relative z-10 flex flex-col items-center justify-center px-8 pt-10 md:px-10">

        <div className="relative flex w-full justify-center">
          <div className="relative flex  h-[80px] items-center justify-left rotate-y-180 ">
          <Image
            src="/images/crystal-butterfly.png"
            alt="Imagen de ejemplo"
            width={300}
            height={100}
          />
        </div>
          <h2 className="font-['Spectral_SC'] text-center text-4xl text-white mx-[5vw] md:text-5xl">
            World Information
          </h2>

                  <div className="relative flex  h-[80px] items-center justify-left ">
          <Image
            src="/images/crystal-butterfly.png"
            alt="Imagen de ejemplo"
            width={300}
            height={100}
          />
        </div>
        </div>

        <div className="relative flex w-[60vw] justify-center  ">
          <p className="mt-6 font-cinzel text-sm text-center tracking-[0.18em] text-white md:text-base pt-5">
             Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ut  hendrerit ligula, in maximus est. Sed et sem sem. Nunc ultricies lorem  at sapien iaculis facilisis. Ut nulla magna, luctus eu lacinia et,  ullamcorper sed nulla. Etiam et mattis sem. Nulla porta lorem egestas  orci iaculis, sed placerat lacus molestie. Nam hendrerit dui eu mauris  porttitor bibendum. Curabitur fermentum tortor ac velit fringilla, sit  amet blandit diam facilisis. Proin in purus lorem. Nulla porta quam eu  mauris dapibus bibendum. Etiam pretium enim hendrerit velit finibus  pellentesque.
          </p>
        </div>
        </div>

        </div>


    </section>

        {/* imagen que divide un div del otros*/}
        <div className="relative flex w-full h-[150px] items-center justify-left rotate-y-180 left-0 mb-20 pl-170 md:mb-20 ">
          <Image
            src="/images/crystal-butterfly.png"
            alt="Imagen de ejemplo"
            width={400}
            height={200}
          />
        </div>
        {/* Vertical color buttons*/ }

                {/* imagen que divide un div del otros*/}
        <div className="relative flex w-full h-[150px] items-center justify-left left-0 mb-20 pl-170 md:mb-20 ">
          <Image
            src="/images/crystal-butterfly.png"
            alt="Imagen de ejemplo"
            width={400}
            height={200}
          />
        </div>

           

         
    

    

    </main>
  );
}

function TitleField({
  title,
}: {
  title: string;
  
}) {
  return (
        <div className="relative flex w-full justify-center">
          <div className="relative flex  h-[80px] items-center justify-left rotate-y-180 ">
          <Image
            src="/images/crystal-butterfly.png"
            alt="Imagen de ejemplo"
            width={300}
            height={100}
          />
        </div>
          <h3 className="font-['Spectral_SC'] text-4xl text-white mx-[5vw] md:text-5xl">
            {title}
          </h3>

                  <div className="relative flex  h-[80px] items-center justify-left ">
          <Image
            src="/images/crystal-butterfly.png"
            alt="Imagen de ejemplo"
            width={300}
            height={100}
          />
        </div>
        </div>
  );
}
