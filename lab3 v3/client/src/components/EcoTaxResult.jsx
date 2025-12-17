import React from 'react';

export default function EcoTaxResult({ result }) {
  const { items, total, passport } = result;
  return (
    <div style={{marginTop:16}}>
      <h4>Результат</h4>
      <div style={{padding:8, border:'1px solid #ccc'}}>
        <div><strong>Загалом (грн):</strong> {total}</div>
        <div><small>Паспорт: {passport?.normalization?.amountUnit}</small></div>
      </div>
      <table style={{width:'100%', marginTop:8, borderCollapse:'collapse'}}>
        <thead>
          <tr>
            <th>Речовина</th><th>Маса (т)</th><th>Ставка (грн/т)</th><th>kTime</th><th>kRegion</th><th>kBenefit</th><th>Підсумок (грн)</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it, i)=>(
            <tr key={i}>
              <td>{it.pollutant}</td>
              <td>{it.amountNormalized ?? it.amount}</td>
              <td>{it.rate}</td>
              <td>{it.kTime}</td>
              <td>{it.kRegion}</td>
              <td>{it.kBenefit}</td>
              <td>{it.subtotal}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
