import { Balloon } from '.prisma/client';
import { Form, useNavigate, useNavigation } from '@remix-run/react';
import { Input } from '~/components/ui/Input';
import { GuestCount } from '~/components/features/balloon/input/GuestCount';
import { BalloonMap } from '~/components/features/balloon/BalloonMap';
import { Button } from '~/components/ui/Button';
import { Loader2 } from 'lucide-react';

export const BalloonForm = ({ balloon }: { balloon?: Balloon }) => {
    const navigation = useNavigation();
    const navigate = useNavigate();
    return (
        <Form method={'post'}>
            <div className={'space-y-2'}>
                <Input
                    required={true}
                    placeholder={'Balloon name'}
                    name={'balloonName'}
                    defaultValue={balloon?.name}
                />
                <GuestCount startingValue={balloon?.guests} />
                <p className='text-sm font-medium leading-none'>Starting location</p>
                <BalloonMap height={200}></BalloonMap>
                <p className='text-sm font-medium leading-none'>Travel dates</p>
                <span className={'grid md:grid-cols-2 gap-2'}>
                    <Input
                        name={'startDate'}
                        required={true}
                        placeholder={'2023-01-10'}
                        defaultValue={balloon?.startDate}
                    />
                    <Input
                        name={'endDate'}
                        required={true}
                        placeholder={'2023-01-19'}
                        defaultValue={balloon?.endDate}
                    />
                </span>
                <span className={'flex justify-end gap-2'}>
                    <Button type={'button'} onClick={() => navigate(-1)} variant={'ghost'}>
                        Cancel
                    </Button>
                    <Button disabled={navigation.state === 'submitting'}>
                        {navigation.state === 'submitting' ? (
                            <>
                                <p>Saving...</p>
                                <Loader2 className={'h-4 w-4 animate-spin'}></Loader2>
                            </>
                        ) : (
                            <p>Save</p>
                        )}
                    </Button>
                </span>
            </div>
        </Form>
    );
};
