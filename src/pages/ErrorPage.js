import Header from "../layouts/Header";
import Footer from "../layouts/Footer";

const ErrorPage = () => {
  return (
    <div className="error-page  ">
      <Header></Header>
      <div className="error-image_container justify-center mx-30 mt-16 flex">
        <img src="/Images/404.png" alt="404-error_image " />
      </div>
      <Footer></Footer>
    </div>
  );
};

export default ErrorPage;
