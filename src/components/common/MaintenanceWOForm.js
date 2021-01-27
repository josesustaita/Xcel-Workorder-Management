import React, { useState } from 'react';
import axios from 'axios';
import { useOktaAuth } from '@okta/okta-react';
import { getAuthHeader } from '../../api/index';

function MaintenanceWOForm({
  title,
  date,
  priority,
  status,
  description,
  id,
  comments,
}) {
  const [workOrder, setWorkOrder] = useState({
    comment: '',
    workOrder: id,
  });

  const WOurl = `${process.env.REACT_APP_API_URI}/company/1/order/${id}`;
  const COMurl = `${process.env.REACT_APP_API_URI}/company/1/order/${id}/comments`;

  //Okta auth
  const { authState } = useOktaAuth();
  const headers = getAuthHeader(authState);

  const putWO = (authState, workOrder) => {
    const headers = getAuthHeader(authState);
    if (!WOurl) {
      throw new Error('No URL provided');
    }
    return axios
      .put(WOurl, workOrder, { headers })
      .then(res => JSON.parse(res.data))
      .catch(err => err);
  };
  const postComWO = (authState, workOrder) => {
    const headers = getAuthHeader(authState);
    if (!COMurl) {
      throw new Error('No URL provided');
    }
    return axios
      .post(COMurl, workOrder, { headers })
      .then(res => JSON.parse(res.data))
      .catch(err => err);
  };

  const handleChange = e => {
    setWorkOrder({ ...workOrder, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    postComWO(authState, workOrder);
  };
  const handleComplete = e => {
    e.preventDefault();
    putWO(authState, { status: 5 });
  };

  return (
    <div>
      <form>
        <h1>{title}</h1>
        <p>Date created: {date}</p>
        <p>Pirority: {priority}</p>
        <p>Status: {status}</p>
        <p>{description}</p>
        <div>
          <p>Comments: {comments}</p>
          <input onChange={handleChange} name="comment" />
        </div>
        <button onClick={handleSubmit}>Update Work Order</button>
        <button onClick={handleComplete}>Mark Complete</button>
      </form>
    </div>
  );
}

export default MaintenanceWOForm;
