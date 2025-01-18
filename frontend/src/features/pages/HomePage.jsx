import Header from "../../common/Header";
import NavBottom from "../../common/NavBottom";
import { FaClock } from "react-icons/fa";
import { TbBarbellFilled } from "react-icons/tb";
import { GiAustralia } from "react-icons/gi";

export default function HomePage() {
  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center bg-white">
        {/* Promotion Image Section */}
        <section
          className="w-full md:w-3/4 h-[500px] md:h-[800px] m-2 flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/Gym-promotion.jpg')`,
          }}
        >
          
        </section>

        {/* Free Trial Section */}
        <section className="w-full flex flex-col items-center justify-center py-8 md:py-12 bg-[#0079B8]">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-4">
            GET STARTED WITH A FREE TRIAL
          </h2>
          <p className="text-white text-center mb-6 max-w-[700px] px-4">
            More than 90 clubs nationwide, 24/7 access and a huge range of group fitness classes to make your health and fitness journey convenient and excuse-free!
          </p>
          <button className="bg-white text-[#0079B8] font-bold py-2 px-8 rounded-full transition duration-300 ease-in-out hover:bg-gray-200">
            Try us for free
          </button>
        </section>

        {/* Service Cards Section */}
        <section className="p-4 mb-24 bg-white">
          {/* Service Title */}
          <div className="w-full text-center mb-6">
            <h3 className="text-xl md:text-2xl font-semibold text-black">Our Services</h3>
          </div>

          {/* Service Cards */}
          <div className="flex flex-col md:flex-row md:justify-center md:items-start space-y-4 md:space-y-0 md:space-x-4">
            {/* Service Card 1 */}
            <div
              className="w-full h-40 md:h-[300px] md:w-[30%] bg-cover bg-center rounded-lg flex flex-col items-center justify-center p-4"
              style={{
                backgroundImage: `url('/service1-bg.jpg')`,
              }}
            >
              <FaClock className="text-2xl md:text-3xl mb-2 text-black" />
              <h2 className="text-md md:text-lg lg:text-xl font-bold mb-2 text-black">
                24 / 7 Services
              </h2>
              <p className="text-center text-xs md:text-sm lg:text-base text-gray-800 font-semibold">
                We’re open 24/7 to fit your busy lifestyle, whether it’s early morning or late night.
              </p>
            </div>

            {/* Service Card 2 */}
            <div
              className="w-full h-40 md:h-[300px] md:w-[30%] bg-cover bg-center rounded-lg flex flex-col items-center justify-center p-4"
              style={{
                backgroundImage: `url('/service2-bg.jpg')`,
              }}
            >
              <TbBarbellFilled className="text-2xl md:text-3xl mb-2 text-black" />
              <h2 className="text-md md:text-lg lg:text-xl font-bold mb-2 text-black">
                Variety of Classes
              </h2>
              <p className="text-center text-xs md:text-sm lg:text-base text-gray-800 font-semibold">
                We offer a range of classes, from yoga to high-intensity workouts, to suit every fitness goal.
              </p>
            </div>

            {/* Service Card 3 */}
            <div
              className="w-full h-40 md:h-[300px] md:w-[30%] bg-cover bg-center rounded-lg flex flex-col items-center justify-center p-4"
              style={{
                backgroundImage: `url('/service3-bg.jpg')`,
              }}
            >
              <GiAustralia className="text-2xl md:text-3xl mb-2 text-black" />
              <h2 className="text-md md:text-lg lg:text-xl font-bold mb-2 text-black">
                Brisbane Wide
              </h2>
              <p className="text-center text-xs md:text-sm lg:text-base text-gray-800 font-semibold">
                With locations across Brisbane, we make staying fit convenient and easy.
              </p>
            </div>
          </div>
        </section>

        {/* Classes Section */}
        {/* <section className="w-full h-[500px] bg-[#f5f5f5] flex flex-col items-center justify-center">
          <h2 className="text-2xl md:text-3xl font-bold text-black text-center mb-4">
            Our Classes
          </h2> */}
           {/* Class Card 1 */}
              {/* <div
                className="relative w-full h-40 md:h-[300px] md:w-[30%] bg-cover bg-center rounded-lg p-4"
                style={{
                  backgroundImage: `url('../frontend/public/blog1.jpg')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  width: '80%',
                  height: '300px',
                  backgroundColor: 'gray', 
                }}
                >
                <h2 className="absolute top-4 left-4 text-md md:text-lg lg:text-xl font-bold text-white">
                  Yoga
                </h2>
              </div> */}

        {/* </section> */}
      </div>
      <NavBottom />
    </>
  );
}
