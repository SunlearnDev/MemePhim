import React from "react";
import Wrapper from "../Wrapper/Wrapper";
import SocialList from "../SocialList/SocialList";
import { Link } from "react-router-dom";
import Logo from "../Logo/Logo";

const Footer = () => {
  return (
    <div className="footer text-center bg-black pt-8 ">
      <Wrapper className="flex">
        <Logo />
        <div className=" flex justify-center items-center w-full ">
        <div class="flex space-x-6 mx-10">
          <a href="" class="text-gray-400 hover:text-white text-sm">
            Về Chúng Tôi
          </a>
          <a href="" class="text-gray-400 hover:text-white text-sm">
            Dịch Vụ
          </a>
          <a href="" class="text-gray-400 hover:text-white text-sm">
            Liên Hệ
          </a>
          <a href="" class="text-gray-400 hover:text-white text-sm">
            Chính Sách Bảo Mật
          </a>
        </div>
        <div class="flex space-x-6 mt-4 md:mt-0">
          <a href="#" class="text-gray-400 hover:text-white text-sm">
            Hỗ Trợ
          </a>
          <a href="#" class="text-gray-400 hover:text-white text-sm">
            FAQ
          </a>
          <a href="#" class="text-gray-400 hover:text-white text-sm">
            Blog
          </a>
          <a href="#" class="text-gray-400 hover:text-white text-sm">
            Điều Khoản Sử Dụng
          </a>
        </div>
        </div>
      </Wrapper>
      <div className="text-[#495057] py-3 text-xs border-t border-t-[#495057] mt-4">
        &copy;Copyright 2023. All rights reserved.
      </div>
    </div>
  );
};

export default Footer;
