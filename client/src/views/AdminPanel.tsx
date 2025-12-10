import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { adminViewModel } from '../viewmodels';
import { FuelType, ProviderType } from '../models';

export const AdminPanel: React.FC = observer(() => {
    const { cars, chargingPoints, isLoading } = adminViewModel;

    // Local state for forms with string types for numbers to allow empty initial state
    const [isAddCarOpen, setIsAddCarOpen] = useState(false);
    const [newCar, setNewCar] = useState({
        make: '',
        model: '',
        seats: '' as any,
        luggageCapacity: '' as any,
        fuelType: FuelType.EV as FuelType,
        provider: ProviderType.DUMMY as ProviderType,
        pricePerHourEstimate: '' as any
    });

    const [isAddPointOpen, setIsAddPointOpen] = useState(false);
    const [newPoint, setNewPoint] = useState({
        name: '',
        latitude: '' as any,
        longitude: '' as any,
        connectorType: 'Type 2',
        status: 'AVAILABLE' as const
    });

    useEffect(() => {
        adminViewModel.loadData();
    }, []);

    const handleAddCar = async (e: React.FormEvent) => {
        e.preventDefault();
        await adminViewModel.addCar({
            ...newCar,
            seats: Number(newCar.seats),
            luggageCapacity: Number(newCar.luggageCapacity),
            pricePerHourEstimate: Number(newCar.pricePerHourEstimate)
        });
        setIsAddCarOpen(false);
        setNewCar({ make: '', model: '', seats: '', luggageCapacity: '', fuelType: FuelType.EV, provider: ProviderType.DUMMY, pricePerHourEstimate: '' });
    };

    const handleAddPoint = async (e: React.FormEvent) => {
        e.preventDefault();
        await adminViewModel.addChargingPoint({ // Type assertion/conversion handled by VM or API if strictly typed, but here we cast
            ...newPoint,
            latitude: Number(newPoint.latitude),
            longitude: Number(newPoint.longitude)
        } as any);
        setIsAddPointOpen(false);
        setNewPoint({ name: '', latitude: '', longitude: '', connectorType: 'Type 2', status: 'AVAILABLE' });
    };

    return (
        <div className="admin-panel">
            <h2 className="mb-4">Admin Beheer</h2>

            {isLoading && <p>Laden...</p>}

            <section className="admin-section card">
                <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ margin: 0 }}>Auto's Beheren</h3>
                    <button className="cta-button" onClick={() => setIsAddCarOpen(!isAddCarOpen)}>
                        {isAddCarOpen ? 'Annuleren' : '+ Auto Toevoegen'}
                    </button>
                </div>

                {isAddCarOpen && (
                    <form className="admin-form mb-4" onSubmit={handleAddCar} style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px' }}>
                        <div className="form-group">
                            <label>Merk</label>
                            <input type="text" placeholder="Bijv. Tesla" value={newCar.make} onChange={e => setNewCar({ ...newCar, make: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Model</label>
                            <input type="text" placeholder="Bijv. Model Y" value={newCar.model} onChange={e => setNewCar({ ...newCar, model: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Aantal Stoelen</label>
                            <input type="number" placeholder="5" value={newCar.seats} onChange={e => setNewCar({ ...newCar, seats: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Bagageruimte</label>
                            <input type="number" placeholder="2" value={newCar.luggageCapacity} onChange={e => setNewCar({ ...newCar, luggageCapacity: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Brandstof / Type</label>
                            <select value={newCar.fuelType} onChange={e => setNewCar({ ...newCar, fuelType: e.target.value as FuelType })}>
                                {Object.values(FuelType).map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Prijs per uur (€)</label>
                            <input type="number" placeholder="Prijs per uur (€)" value={newCar.pricePerHourEstimate} onChange={e => setNewCar({ ...newCar, pricePerHourEstimate: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Provider</label>
                            <select value={newCar.provider} onChange={e => setNewCar({ ...newCar, provider: e.target.value as ProviderType })}>
                                {Object.values(ProviderType).map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <button type="submit">Opslaan</button>
                    </form>
                )}

                <div style={{ overflowX: 'auto' }}>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Merk/Model</th>
                                <th>Provider</th>
                                <th>Prijs/u</th>
                                <th>Acties</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cars.map(car => (
                                <tr key={car.id}>
                                    <td>{car.make} {car.model} ({car.fuelType})</td>
                                    <td>{car.provider}</td>
                                    <td>€{car.pricePerHourEstimate}</td>
                                    <td>
                                        <button onClick={() => adminViewModel.deleteCar(car.id)} className="delete-btn" style={{ borderRadius: '4px', fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}>Verwijder</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="admin-section card">
                <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ margin: 0 }}>Laadpunten Beheren</h3>
                    <button className="cta-button" onClick={() => setIsAddPointOpen(!isAddPointOpen)}>
                        {isAddPointOpen ? 'Annuleren' : '+ Laadpunt Toevoegen'}
                    </button>
                </div>

                {isAddPointOpen && (
                    <form className="admin-form mb-4" onSubmit={handleAddPoint} style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px' }}>
                        <div className="form-group">
                            <label>Naam</label>
                            <input type="text" placeholder="Bijv. Fastned Rotterdam" value={newPoint.name} onChange={e => setNewPoint({ ...newPoint, name: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Status</label>
                            <select value={newPoint.status} onChange={e => setNewPoint({ ...newPoint, status: e.target.value as any })}>
                                <option value="AVAILABLE">Beschikbaar</option>
                                <option value="OCCUPIED">Bezet</option>
                                <option value="UNKNOWN">Onbekend</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Latitude</label>
                            <input type="number" placeholder="52.08" step="any" value={newPoint.latitude} onChange={e => setNewPoint({ ...newPoint, latitude: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Longitude</label>
                            <input type="number" placeholder="4.32" step="any" value={newPoint.longitude} onChange={e => setNewPoint({ ...newPoint, longitude: e.target.value })} required />
                        </div>
                        <button type="submit">Opslaan</button>
                    </form>
                )}

                <ul className="admin-list" style={{ listStyle: 'none', padding: 0 }}>
                    {chargingPoints.map(cp => (
                        <li key={cp.id} className="list-item" style={{ padding: '1rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>{cp.name} ({cp.status}) - [{cp.latitude.toFixed(3)}, {cp.longitude.toFixed(3)}]</span>
                            <button onClick={() => adminViewModel.deleteChargingPoint(cp.id)} className="delete-btn" style={{ borderRadius: '4px', fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}>Verwijder</button>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
});
