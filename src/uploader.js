import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      uploaderVisible: false,
      error: false,
      success: false,
      success: false,
      inProp: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  closeModal() {
    document.querySelector("div.modal-background").style.animation =
      "fadeOff 0.3s";
    setTimeout(() => {
      this.setState({ uploaderVisible: false });
    }, 300);
  }

  componentDidMount() {
    this.setState({ uploaderVisible: true });
  }

  //handleChange for file upload
  handleChange(event) {
    this.setState({
      uploaderVisible: true
    });

    const fomData = new FormData();

    this.setState({ file: event.target.files[0] }, () => {
      fomData.append("file", this.state.file);
    });

    axios
      .post("/upload", fomData)
      .then(({ data }) => {
        if (data.error) {
          this.setState({ error: true });
          return;
        } else {
          this.setState({ error: false });
          this.setState({ success: true });
          this.props.finishedUploading(data);
          this.setState({ uploaderVisible: false });
        }
      })
      .catch(function(error) {
        this.state({ error: true });
      });
  }

  render() {
    return (
      <div>
        {this.state.uploaderVisible === true && (
          <div className="modal-background">
            <div className="uploader-modal">
              <div className="close-info" onClick={this.closeModal}>
                X
              </div>
              <span className="uploader">
                please upload your profile picture
              </span>
              <form>
                <label htmlFor="file-upload" className="custom-file-upload">
                  UPLOAD IMAGE
                  <img
                    className="logo-upload"
                    src="download-file.svg"
                    alt="download"
                  />
                </label>
                <input
                  onChange={this.handleChange}
                  id="file-upload"
                  className="file"
                  type="file"
                  name="file"
                  accept="image/*"
                />
              </form>
              {this.state.error && (
                <span className="error">
                  Error: please make try again with a file below 800kb.
                </span>
              )}
              {this.state.success && (
                <span className="success">
                  Success: your image is being uploaded!
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}
