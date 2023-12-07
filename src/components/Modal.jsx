import { FormSumbitStyleCancel } from './Helpers';
import './modal.css';

const Modal = ({ show, formContent, handleClose }) => {
  const showHideClassName = show ? "modal display-block" : "modal display-none";

  return (
    <div className={showHideClassName}>
      <section className="modal-main">
          <button type="button" className={FormSumbitStyleCancel + 'float-right'} onClick={handleClose}>
            Close
          </button>
        {/* <form onSubmit={handleClose}> */}
          {/* <div className="flex flex-col justify-center items-center">
            <label>Confirm deletion?</label>
            <input className={FormSumbitStyle} type="submit" />
          </div> */}
          {formContent}
        {/* </form> */}
      </section>
    </div>
  );
};

export default Modal;