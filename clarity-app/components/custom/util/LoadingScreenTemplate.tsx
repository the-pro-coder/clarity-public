import { BallTriangle } from "react-loader-spinner";
export default function LoadingScreenTemplate() {
  return (
    <div className="w-dvw h-dvh absolute top-0 left-0 flex justify-center items-center">
      <div className="w-dvw h-dvh border bg-white opacity-50 absolute top-0 left-0"></div>
      <div className="z-100 absolute w-full h-full flex justify-center items-center">
        <BallTriangle height={70} width={70} color="#598bff" />
      </div>
    </div>
  );
}
