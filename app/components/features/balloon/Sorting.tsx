import { useSearchParams } from '@remix-run/react';
import React, { Fragment, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronDown } from 'lucide-react';

export const Sorting = () => {
    const sortingNames = new Map([
        ['none', 'None'],
        ['distance', 'Distance'],
        ['price', 'Price'],
        ['locationName', 'Location name'],
    ]);

    const [searchParams, setSearchParams] = useSearchParams();
    const updateUrl = (value: string) => {
        setSelected(value);
        searchParams.set('sort', value);
        setSearchParams(searchParams);
    };
    const sort = searchParams.get('sort');
    const [selected, setSelected] = useState(sort ?? 'none');

    return (
        <Listbox value={selected} onChange={(value) => updateUrl(value)}>
            <div className={'relative'}>
                <Listbox.Button
                    className={
                        'rounded-full py-0.5 px-3 flex items-center gap-2 bg-white shadow-md border text-sm'
                    }>
                    <p className={'text-gray-600'}>Sort:</p>
                    <span className={'block truncate font-medium'}>
                        {sortingNames.get(selected)}
                    </span>
                    <ChevronDown className={'stroke-gray-600 stroke-1'} />
                </Listbox.Button>
                <Transition
                    as={Fragment}
                    leave={'transition ease-in duration-100'}
                    leaveFrom={'opacity-100'}
                    leaveTo={'opacity-0'}>
                    <Listbox.Options
                        className={
                            'absolute mt-1 max-h-60 max-w-max px-5 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10'
                        }>
                        {Array.from(sortingNames).map(([key, value], index) => (
                            <Listbox.Option
                                key={index}
                                className={
                                    'relative cursor-default select-none px-5 py-2 rounded-full'
                                }
                                value={key}>
                                {({ selected }) => (
                                    <div className={'flex items-center gap-2'}>
                                        <span
                                            className={`block truncate text-gray-600 text-sm ${
                                                selected ? 'font-medium' : 'font-normal'
                                            }`}>
                                            {value}
                                        </span>
                                        {selected ? (
                                            <span className={'left-0 flex items-center p-1'}>
                                                <CheckIcon
                                                    className={'h-5 w-5'}
                                                    aria-hidden={'true'}
                                                />
                                            </span>
                                        ) : null}
                                    </div>
                                )}
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </Transition>
            </div>
        </Listbox>
    );
};
