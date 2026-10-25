import "./Input.scss"
import { KTIcon } from "../../../_metronic/helpers/components/KTIcon";
import type React from "react";

type inputProps = {
    label?: string;
    type?: string;
    placeholder?: string;
    icon?: string;
    value?: string;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    onBlur?: React.FocusEventHandler<HTMLInputElement>;
    lableRight?: React.ReactNode
    rightIcon?: React.ReactNode
    name?: string
    checked?: boolean;

};
export default function Input({
    label,
    type = "text",
    placeholder,
    icon,
    value,
    onChange,
    lableRight,
    rightIcon,
    onBlur,
    name,
    checked

}: inputProps) {
    if (type === "checkbox") {
        return (
            <label className="flex cursor-pointer items-center gap-2.5 select-none">
                <input
                    name={name}
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                    onBlur={onBlur}
                    className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-indigo-600"
                />

                <span className="text-sm font-semibold text-slate-700">
                    {label}
                </span>
            </label>
        )
    }
    return (
        <div>
            <div className="mb-1.5 flex items-center justify-between">
                {label && (
                    <label className="text-sm font-medium text-slate-700">
                        {label}
                    </label>
                )}

                {lableRight}
            </div>
            <div className="relative">

                {icon && (
                    <KTIcon
                        iconName={icon}
                        className="fs-18 pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                )}
                <input
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    className="bg-input w-full rounded-xl border border-slate-200 py-3.5 pr-11 pl-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                />

                {rightIcon && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {rightIcon}
                    </div>
                )}

            </div>

        </div>
    )
}
