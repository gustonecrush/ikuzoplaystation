function Card({ variant, extra, onClick, children, ...rest }) {
    return (
      <div
        onClick={onClick}
        className={`!z-5 relative flex flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl ${
          variant === 'default'
            ? 'shadow-shadow-500 dark:shadow-none'
            : 'shadow-shadow-100 dark:shadow-none'
        }  dark:!bg-navy-800 dark:text-white  ${extra}`}
        {...rest}
      >
        {children}
      </div>
    );
  }
  
  export default Card;
  