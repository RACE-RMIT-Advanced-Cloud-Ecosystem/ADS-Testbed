import PropTypes from "prop-types";
import { PiDownloadFill } from "react-icons/pi";
import BasicButton from "./BasicButton";

function ExportButton({ onClick }) {
    return (
        <BasicButton onClick={onClick} icon={<PiDownloadFill />} text="Export" variation="secondary" />
    )
}

ExportButton.propTypes = {
    onClick: PropTypes.func.isRequired
}


export default ExportButton;