import { dentalServices, type ServiceId } from './clinic-data';

export default function ServiceDetails({ serviceId }: { serviceId: ServiceId }) {
  const service = dentalServices.find((item) => item.id === serviceId)!;
  return <details className="clinic-service-details">
    <summary>Подробнее об услуге <span aria-hidden="true">+</span></summary>
    <div className="clinic-service-details-body">
      <div><h4>Что входит в направление</h4><ul>{service.gives.map((item) => <li key={item}>{item}</li>)}</ul></div>
      <div><h4>Когда обратиться</h4><ul>{service.fits.map((item) => <li key={item}>{item}</li>)}</ul></div>
      <p>Метод, объём и стоимость лечения определяются после осмотра.</p>
    </div>
  </details>;
}
