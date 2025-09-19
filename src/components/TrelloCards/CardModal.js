import React, { forwardRef } from "react";

const CardModal = forwardRef(({ title }, ref) => {
  return (
    <div className="modal fade" ref={ref} tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content bg-transparent border-0">
          <div className="modal-body d-flex p-0">
            {/* LEFT SIDE */}
            <div
              className="flex-grow-1 p-4"
              style={{ backgroundColor: "#1d2125", color: "#fff" }}
            >
              {/* Card Name */}
              <h3 className="fw-bold">{title}</h3>

              {/* Description Section */}
              <div className="mt-4">
                <h6 className="text-light">Description</h6>
                <textarea
                  className="form-control bg-dark text-light border-secondary mt-2"
                  placeholder="Add a more detailed description..."
                  rows="4"
                ></textarea>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div
              className="p-4 border-start"
              style={{ width: "300px", backgroundColor: "#101204", color: "#fff" }}
            >
              <h6 className="mb-3">Comments and Activity</h6>
              <input
                type="text"
                className="form-control bg-dark text-light border-secondary mb-3"
                placeholder="Write a comment..."
              />
              <div className="activity">
                <p className="mb-0">
                  <strong>Nahail Ahmad</strong> added this card <br />
                  <small className="text-muted">just now</small>
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer border-0 bg-dark">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default CardModal;
