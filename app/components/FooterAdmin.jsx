const FooterAdmin = () => {
    return (
      <div className="flex w-full flex-col items-center justify-between px-1 pb-8 pt-3 lg:px-8 xl:flex-row">
        <p className="mb-4 text-center text-sm font-medium text-gray-600 sm:!mb-0 md:text-lg">
          <span className="mb-4 text-center text-sm text-gray-600 sm:!mb-0 md:text-base">
            ©{new Date().getFullYear()} Ikuzo Playstation. All Rights Reserved.
          </span>
        </p>
        <div>
          <ul className="flex flex-wrap items-center gap-3 sm:flex-nowrap md:gap-10">
            <li>
              <a
                target="_blank"
                href="mailto:hello@simmmple.com"
                className="text-base font-medium text-gray-600 hover:text-gray-600"
              >
                Support
              </a>
            </li>
            <li>
              <a
                target="_blank"
                href="https://simmmple.com/licenses"
                className="text-base font-medium text-gray-600 hover:text-gray-600"
              >
                License
              </a>
            </li>
            <li>
              <a
                target="_blank"
                href="https://simmmple.com/terms-of-service"
                className="text-base font-medium text-gray-600 hover:text-gray-600"
              >
                Terms of Use
              </a>
            </li>
            <li>
              <a
                target="_blank"
                href="https://blog.horizon-ui.com/"
                className="text-base font-medium text-gray-600 hover:text-gray-600"
              >
                Blog
              </a>
            </li>
          </ul>
        </div>
      </div>
    );
  };
  
  export default FooterAdmin;
  