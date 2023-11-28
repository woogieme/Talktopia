import React from 'react';
import './ReporterTable.css';
import { useTranslation } from "react-i18next";
const ReporterTable = ({ data }) => {
    const { t } = useTranslation();
    return (
        <table className="reporter-table">
            <thead>
                <tr>
                    <th>{t(`ReporterTable.ReporterTable1`)}</th>
                    <th>{t(`ReporterTable.ReporterTable2`)}</th>
                    <th>{t(`ReporterTable.ReporterTable3`)}</th>
                    <th>{t(`ReporterTable.ReporterTable4`)}</th>
                    <th>{t(`ReporterTable.ReporterTable5`)}</th>
                    <th>{t(`ReporterTable.ReporterTable6`)}</th>
                </tr>
            </thead>
            <tbody>
                {data.map((entry) => (
                    <tr key={entry.ruId}>
                        <td>{entry.ruId}</td>
                        <td>{entry.ruReporter}</td>
                        <td>{entry.ruBully}</td>
                        <td>{entry.ruBody}</td>
                        <td>{entry.ruCreateTime}</td>
                        <td>{entry.ruVrSession}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default ReporterTable;
