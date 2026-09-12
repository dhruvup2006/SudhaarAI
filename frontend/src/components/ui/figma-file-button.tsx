import { Button } from "@/components/ui/button";

const ButtonFigmaDemo = () => {
  return (
    <>
      <div className="w-fit h-fit inline-flex items-center justify-center rounded-md bg-gradient-to-r from-[#F24E1E] via-[#A259FF] to-[#1ABCFE] p-[1px]">
        <Button className="bg-black hover:bg-zinc-900 text-white cursor-pointer gap-2">
          <img
            src="https://images.shadcnspace.com/assets/svgs/icon-figma.svg"
            alt="figma"
            className="h-4 w-4"
          />
          Get Figma File
        </Button>
      </div>
    </>
  );
};

export default ButtonFigmaDemo;
