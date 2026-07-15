// src/components/entry-Layout/MarkdownContent.tsx

type MarkdownContentProps = {
  children: React.ReactNode;
};

export default function MarkdownContent({ children }: MarkdownContentProps) {
  return (
    <div
      className="
        prose
        prose-invert
        max-w-none
        text-white

        prose-p:text-sm
        prose-p:leading-7
        sm:prose-p:text-base
        sm:prose-p:leading-8

        prose-a:text-[#FFF48E]
        prose-a:transition-colors
        prose-a:hover:text-[#FFF48E]/80

        [&_h1]:mb-8
        [&_h1]:font-[Spectral_SC]
        [&_h1]:!text-4xl
        [&_h1]:font-bold
        [&_h1]:uppercase
        [&_h1]:tracking-wider
        md:[&_h1]:!text-5xl

        [&_h2]:mb-5
        [&_h2]:mt-10
        [&_h2]:font-[Spectral_SC]
        [&_h2]:!text-3xl
        [&_h2]:font-bold
        [&_h2]:uppercase
        [&_h2]:tracking-wider

        [&_h3]:mb-5
        [&_h3]:mt-10
        [&_h3]:font-[Spectral_SC]
        [&_h3]:!text-2xl
        [&_h3]:font-bold
        [&_h3]:uppercase
        [&_h3]:tracking-wider

        [&_h4]:mb-5
        [&_h4]:mt-10
        [&_h4]:font-[Spectral_SC]
        [&_h4]:!text-xl
        [&_h4]:font-bold
        [&_h4]:uppercase
        [&_h4]:tracking-wider

        [&_p]:my-5
        [&_p]:max-w-none

        [&_ul]:my-5
        [&_ul]:list-disc
        [&_ul]:pl-6
        sm:[&_ul]:pl-8

        [&_li]:my-2

        [&_img]:mx-auto
        [&_img]:my-10
        [&_img]:h-auto
        [&_img]:max-h-[420px]
        [&_img]:max-w-full
        [&_img]:w-auto
        [&_img]:rounded-md
        sm:[&_img]:my-12

        [&_blockquote]:my-8
        [&_blockquote]:rounded-md
        [&_blockquote]:border-l-4
        [&_blockquote]:border-[#FFF48E]
        [&_blockquote]:bg-[#FFF48E]/10
        [&_blockquote]:px-4
        [&_blockquote]:py-4
        [&_blockquote]:shadow-[0_0_18px_rgba(255,244,142,0.18)]
        sm:[&_blockquote]:px-6

        [&_blockquote_p]:my-0
        [&_blockquote_p]:font-cinzel
        [&_blockquote_p]:text-sm
        [&_blockquote_p]:leading-7
        [&_blockquote_p]:tracking-wide
        [&_blockquote_p]:text-[#FFF48E]
        sm:[&_blockquote_p]:leading-8

        [&_blockquote_p:first-of-type::before]:content-none
        [&_blockquote_p:last-of-type::after]:content-none
      "
    >
      {children}
    </div>
  );
}