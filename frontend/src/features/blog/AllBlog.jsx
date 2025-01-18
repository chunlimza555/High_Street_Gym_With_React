import Header from "../../common/Header";
import NavBottom from "../../common/NavBottom";
import BlogNav from "../../common/blog/Blognav";
import Allblogcard from "../../common/blog/Allblog";

export default function Allblog() {
  return (
    <>
      <Header />

      <div
        className="flex flex-col items-center justify-center min-h-screen"
        style={{
          backgroundColor: "#f5f5f5", // Ensure the correct path to the background image
          backgroundSize: "cover",           // Cover the entire background
          backgroundPosition: "center",      // Center the background image
          backgroundRepeat: "no-repeat",     // Prevent repeating
          backgroundAttachment: "fixed",     // Keeps the background fixed while scrolling
          minHeight: "100vh",                // Ensures the background covers the full viewport height
        }}
      >
        <div className="w-full max-w-4xl bg-opacity-80 p-6 rounded-lg shadow-lg bg-[#6cb1e6] m-2">
          <BlogNav />
          <Allblogcard />
        </div>
      </div>

      <NavBottom />
    </>
  );
}
