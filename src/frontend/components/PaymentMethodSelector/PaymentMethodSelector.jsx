import React from 'react';
import { PAYMENT_TYPES } from '../../constants/constants';
import { useCurrencyContext } from '../../contexts/CurrencyContextProvider';
import Price from '../Price';
import styles from './PaymentMethodSelector.module.css';

const PaymentMethodSelector = ({ 
  selectedPaymentMethod, 
  onPaymentMethodChange, 
  cartTotal,
  bankTransferSurcharge 
}) => {
  const { getCurrentCurrency, formatPriceWithCode } = useCurrencyContext();
  const currency = getCurrentCurrency();

  const handlePaymentChange = (paymentType) => {
    onPaymentMethodChange(paymentType);
  };

  const totalWithSurcharge = cartTotal + bankTransferSurcharge;

  return (
    <div className={styles.paymentSelector}>
      <div className={styles.selectorHeader}>
        <h4>💳 Método de Pago</h4>
        <p>Selecciona cómo deseas pagar tu pedido</p>
      </div>

      <div className={styles.paymentOptions}>
        {/* Opción de Pago en Efectivo */}
        <div className={styles.paymentOption}>
          <input
            type="radio"
            id="cash-payment"
            name="paymentMethod"
            value={PAYMENT_TYPES.CASH}
            checked={selectedPaymentMethod === PAYMENT_TYPES.CASH}
            onChange={() => handlePaymentChange(PAYMENT_TYPES.CASH)}
          />
          <label htmlFor="cash-payment" className={styles.paymentLabel}>
            <div className={styles.paymentIcon}>💵</div>
            <div className={styles.paymentInfo}>
              <h5>Pago en Efectivo</h5>
              <p>Paga directamente en la tienda al momento de la entrega o recogida</p>
              <div className={styles.paymentAmount}>
                <span className={styles.totalLabel}>Total a pagar:</span>
                <span className={styles.totalAmount}>
                  <Price amount={cartTotal} />
                </span>
              </div>
              <div className={styles.paymentBenefits}>
                <span className={styles.benefit}>✅ Sin recargos adicionales</span>
                <span className={styles.benefit}>✅ Pago directo en tienda</span>
                <span className={styles.benefit}>✅ Verificación inmediata</span>
              </div>
            </div>
          </label>
        </div>

        {/* Opción de Transferencia Bancaria */}
        <div className={styles.paymentOption}>
          <input
            type="radio"
            id="bank-transfer"
            name="paymentMethod"
            value={PAYMENT_TYPES.BANK_TRANSFER}
            checked={selectedPaymentMethod === PAYMENT_TYPES.BANK_TRANSFER}
            onChange={() => handlePaymentChange(PAYMENT_TYPES.BANK_TRANSFER)}
          />
          <label htmlFor="bank-transfer" className={styles.paymentLabel}>
            <div className={styles.paymentIcon}>🏦</div>
            <div className={styles.paymentInfo}>
              <h5>Transferencia Bancaria</h5>
              <p>Realiza el pago mediante transferencia bancaria antes de la entrega</p>
              
              <div className={styles.priceBreakdown}>
                <div className={styles.priceRow}>
                  <span>Subtotal productos:</span>
                  <Price amount={cartTotal} />
                </div>
                <div className={styles.priceRow}>
                  <span>Recargo transferencia (20%):</span>
                  <span className={styles.surchargeAmount}>
                    +<Price amount={bankTransferSurcharge} />
                  </span>
                </div>
                <div className={`${styles.priceRow} ${styles.totalRow}`}>
                  <span className={styles.totalLabel}>Total a pagar:</span>
                  <span className={styles.totalAmount}>
                    <Price amount={totalWithSurcharge} />
                  </span>
                </div>
              </div>

              <div className={styles.currencyInfo}>
                <span className={styles.currencyFlag}>{currency.flag}</span>
                <span className={styles.currencyText}>
                  Precios en {currency.name} ({currency.code})
                </span>
                {currency.code !== 'CUP' && (
                  <span className={styles.exchangeRate}>
                    1 {currency.code} = {currency.rate.toLocaleString()} CUP
                  </span>
                )}
              </div>

              <div className={styles.paymentBenefits}>
                <span className={styles.benefit}>✅ Pago anticipado seguro</span>
                <span className={styles.benefit}>✅ Confirmación por WhatsApp</span>
                <span className={styles.warning}>⚠️ Incluye recargo del 20%</span>
              </div>
            </div>
          </label>
        </div>
      </div>

      {selectedPaymentMethod === PAYMENT_TYPES.BANK_TRANSFER && (
        <div className={styles.bankTransferInfo}>
          <div className={styles.infoHeader}>
            <h5>🏦 Información de Transferencia Bancaria</h5>
          </div>
          <div className={styles.infoContent}>
            <div className={styles.infoItem}>
              <strong>📋 Instrucciones:</strong>
              <p>1. Realiza la transferencia por el monto total mostrado</p>
              <p>2. Envía el comprobante por WhatsApp</p>
              <p>3. Espera la confirmación de pago</p>
              <p>4. Coordina la entrega o recogida</p>
            </div>
            <div className={styles.infoItem}>
              <strong>💰 Monto a transferir:</strong>
              <div className={styles.transferAmount}>
                <Price amount={totalWithSurcharge} />
                <span className={styles.currencyNote}>
                  ({currency.flag} {currency.name})
                </span>
              </div>
            </div>
            <div className={styles.infoItem}>
              <strong>⚠️ Importante:</strong>
              <p>El recargo del 20% se aplica automáticamente a todos los productos por concepto de transferencia bancaria</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethodSelector;