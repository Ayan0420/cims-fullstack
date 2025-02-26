import { faPowerOff } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button } from "react-bootstrap"

const LegacyJoms = () => {

  return (
    <div className="position-relative">
        <div className="position-absolute bottom-0 start-0 p-3">
            <Button variant="dark" size="sm">
                <FontAwesomeIcon icon={faPowerOff}/> Shutdown Old System
            </Button>
        </div>
        <iframe src={`${import.meta.env.VITE_LEGACY_JOMS_URL}`} style={{width: '100%', height: '100vh'}} />
    
    </div>
  )
}

export default LegacyJoms