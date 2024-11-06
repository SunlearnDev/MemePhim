import React from "react";
import Wrapper from "../Wrapper/Wrapper";
import SocialList from "../SocialList/SocialList";
import { Link } from "react-router-dom";
import Logo from "../Logo/Logo";

const Footer = () => {
  return (
    <div className="footer text-center bg-black pt-8 text-gray-400">
      <Wrapper className="flex flex-col items-center space-y-6">
        {/* Logo */}
        <Logo />

        {/* Short description */}
        <p className="text-center text-sm max-w-md mx-auto leading-relaxed">
          Chào mừng bạn đến với trang web của chúng tôi! Chúng tôi cung cấp các dịch vụ tốt nhất về phim ảnh, 
          giải trí, và cập nhật những xu hướng mới nhất. Hãy theo dõi và ủng hộ chúng tôi!
        </p>

        {/* Navigation Links */}
        <div className="flex justify-center space-x-10">
          <div className="flex flex-col items-center space-y-2">
            <Link to="/about" className="hover:text-white text-sm">
              Về Chúng Tôi
            </Link>
            <Link to="/services" className="hover:text-white text-sm">
              Dịch Vụ
            </Link>
            <Link to="/contact" className="hover:text-white text-sm">
              Liên Hệ
            </Link>
            <Link to="/privacy-policy" className="hover:text-white text-sm">
              Chính Sách Bảo Mật
            </Link>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <Link to="/support" className="hover:text-white text-sm">
              Hỗ Trợ
            </Link>
            <Link to="/faq" className="hover:text-white text-sm">
              FAQ
            </Link>
            <Link to="/blog" className="hover:text-white text-sm">
              Blog
            </Link>
            <Link to="/terms-of-service" className="hover:text-white text-sm">
              Điều Khoản Sử Dụng
            </Link>
          </div>
        </div>

        {/* Social Media Links */}
        <SocialList className="flex justify-center space-x-4 mt-4">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
            <i className="fab fa-youtube"></i>
          </a>
        </SocialList>
      </Wrapper>

      {/* Footer Bottom */}
      <div className="text-[#495057] py-4 text-xs border-t border-t-[#495057] mt-8">
        <Wrapper className="flex flex-col md:flex-row justify-between items-center">
          <p className="mb-4 md:mb-0">
            &copy; 2023. All rights reserved.
          </p>
          <p className="text-sm">
            Powered by <span className="text-white font-semibold">Your Company</span>
          </p>
        </Wrapper>
      </div>
    </div>
  );
};

export default Footer;
