import { BiTransfer } from "react-icons/bi";
import { BsStack } from "react-icons/bs";
import { FaDatabase, FaFolder, FaHandshake, FaShieldAlt } from "react-icons/fa";
import { IoDocument, IoDocumentText } from "react-icons/io5";
import { TbNetwork } from "react-icons/tb";
import { MdDataset } from "react-icons/md";

export default {
    'contract': <FaHandshake />,
    'agreement': <IoDocumentText />,
    'representation': <BsStack />,
    'artifact': <IoDocument />,
    'policy': <FaShieldAlt />,
    'request': <BiTransfer />,
    'resource': <FaDatabase />,
    'catalog': <FaFolder />,
    'broker': <TbNetwork />,
    'dataset': <MdDataset />
}