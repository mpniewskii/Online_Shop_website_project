import React, { useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios'; 
import './OrderComponent.css';
import { OrderContext } from '../contexts/OrderContext'; // importuj kontekst zamówienia

const validationSchema = Yup.object().shape({
  name: Yup.string().trim().required('Imię jest wymagane'),
  deliveryType: Yup.string().required('Wybierz sposób dostawy'),
  address: Yup.string().trim().required('Podaj adres'),
  email: Yup.string().email('Nieprawidłowy adres email').trim().required('Podaj adres email'),
});

function OrderForm() {
  const { order, setOrder } = useContext(OrderContext); // użyj kontekstu zamówienia
  const { cartItems, deliveryCost } = order;

  const totalCost = cartItems.reduce((total, item) => total + item.priceWithoutDelivery * item.quantity, 0) + deliveryCost;

  const formik = useFormik({
    initialValues: {
      name: '',
      deliveryType: '',
      address: '',
      email: '',
    },
    validationSchema,
    onSubmit: (values) => {
      const orderData = {
        ...values,
        deliveryMethod: 'normalna',
        deliveryCost: deliveryCost,
        products: cartItems,
      };

      axios.post('http://localhost:3001/order/create', orderData)
        .then(response => {
          console.log(response.data);
          alert('Zakup potwierdzony!');
          formik.resetForm();
          setOrder({ cartItems: [], deliveryCost: 0 }); // resetuj dane zamówienia po złożeniu zamówienia
        })
        .catch(error => {
          console.error('There was an error!', error);
        });
    },
  });

  return (
    <div className="orderFormContainer">
      <h2 className="orderFormTitle">Twoje zamówienie:</h2>
      <ul className="orderFormList">
        {cartItems.map((item, index) => (
          <li key={index} className="orderFormListItem">
            {item.title} - {item.quantity} szt. - {item.priceWithoutDelivery * item.quantity} zł
          </li>
        ))}
      </ul>
      <h3 className="orderFormTotalCost">Całkowity koszt: {totalCost} zł</h3>

      <form onSubmit={formik.handleSubmit} className="flex flex-col w-full">
      <div className="inputContainer">
        <label className="orderFormLabel">
          Imię i nazwisko:
        </label>
        {formik.touched.name && formik.errors.name ? <div>{formik.errors.name}</div> : null}
        <input type="text" name="name" onChange={formik.handleChange} value={formik.values.name} className="orderFormInput" />
      </div>
      <div className="inputContainer">
        <label className="orderFormLabel">
          Typ dostawy:
        </label>
        {formik.touched.deliveryType && formik.errors.deliveryType ? <div>{formik.errors.deliveryType}</div> : null}
        <select name="deliveryType" onChange={formik.handleChange} value={formik.values.deliveryType} className="orderFormInput">
          <option value="">Wybierz...</option>
          <option value="kurier">Kurier</option>
          <option value="paczkomat">Paczkomat</option>
        </select>
      </div>
      <div className="inputContainer">
        <label className="orderFormLabel">
          Adres:
        </label>
        {formik.touched.address && formik.errors.address ? <div>{formik.errors.address}</div> : null}
        <input type="text" name="address" onChange={formik.handleChange} value={formik.values.address} className="orderFormInput" />
      </div>
      <div className="inputContainer">
        <label className="orderFormLabel">
          Email:
        </label>
        {formik.touched.email && formik.errors.email ? <div>{formik.errors.email}</div> : null}
        <input type="email" name="email" onChange={formik.handleChange} value={formik.values.email} className="orderFormInput" />
      </div>
      <button type="submit" className="orderFormButton">Potwierdź</button>
    </form>
  </div>
);
}

export default OrderForm;