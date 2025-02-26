

const LoadingOverlay: React.FC<{message:string}> = ({message}) => {
  return (
    <div className="loading-overlay d-flex flex-column gap-3">
        <div className="loader"></div>
        <h1 className='text-black'>{message}</h1>
    </div>
  )
}

export default LoadingOverlay