"use client";

import { projectsData } from '@/utils/data/projects-data';
import ProjectCard from './project-card';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";

function NextArrow(props) {
  const { onClick } = props;
  return (
    <div
      className="absolute group hidden lg:flex items-center justify-center bg-[#1a1443] hover:bg-[#16f2b3] rounded-full cursor-pointer transition-all duration-300 ease-in-out hover:scale-110"
      style={{ width: '80px', height: '80px', right: '-80px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}
      onClick={onClick}
    >
      <FaArrowRight className="text-[#16f2b3] text-3xl group-hover:text-white transition-colors duration-300 animate-bounce-right" />
    </div>
  );
}

function PrevArrow(props) {
  const { onClick } = props;
  return (
    <div
      className="absolute group hidden lg:flex items-center justify-center bg-[#1a1443] hover:bg-[#16f2b3] rounded-full cursor-pointer transition-all duration-300 ease-in-out hover:scale-110"
      style={{ width: '80px', height: '80px', left: '-80px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}
      onClick={onClick}
    >
      <FaArrowLeft className="text-[#16f2b3] text-3xl group-hover:text-white transition-colors duration-300 animate-bounce-left" />
    </div>
  );
}

const Projects = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "0px",
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          centerPadding: "0px",
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          centerPadding: "0px",
          arrows: false,
          dots: false,
        }
      }
    ]
  };

  return (
    <div id='projects' className="relative z-50 my-12 lg:my-24">
      <div className="sticky top-10">
        <div className="w-[80px] h-[80px] bg-violet-100 rounded-full absolute -top-3 left-0 translate-x-1/2 filter blur-3xl opacity-30"></div>
        <div className="flex items-center justify-start relative">
          <span className="bg-[#1a1443] absolute left-0 w-fit text-white px-5 py-3 text-xl rounded-md">
            PROJECTS
          </span>
          <span className="w-full h-[2px] bg-[#1a1443]"></span>
        </div>
      </div>

      <div className="pt-24 px-4 lg:px-12">
        <Slider {...settings}>
          {projectsData.map((project, index) => (
            <div key={index} className="px-2"> {/* Added padding wrapper for card spacing */}
              <div className="box-border flex items-center justify-center rounded shadow-[0_0_30px_0_rgba(0,0,0,0.3)] transition-all duration-[0.5s]  h-full w-full mx-auto max-w-2xl">
                <ProjectCard project={project} />
              </div>
            </div>
          ))}
        </Slider>

        {/* Mobile Swipe Hint */}
        <div className="flex justify-center mt-2 lg:hidden">
          <div className="flex items-center gap-2 text-[#16f2b3] animate-pulse">
            <FaArrowLeft />
            <span className="text-sm">Swipe for more</span>
            <FaArrowRight />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;
