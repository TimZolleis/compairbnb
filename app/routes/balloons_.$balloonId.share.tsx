import { DataFunctionArgs, json } from '@remix-run/node';
import { requireUser } from '~/utils/auth/session.server';
import { useFetcher, useLoaderData, useNavigate } from '@remix-run/react';
import { Modal } from '~/components/ui/Modal';
import { requireParameter } from '~/utils/form/formdata.server';
import { prisma } from '../../prisma/db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/Card';
import { requireOwnership } from '~/utils/auth/permission.server';
import { requireResult } from '~/models/listing.server';
import { Balloon } from '.prisma/client';
import { BookOpenCheck, Clipboard, Pen } from 'lucide-react';
import { Switch } from 'react-aria-components';
import { useEffect, useState } from 'react';
import { Button } from '~/components/ui/Button';
import { encryptString } from '~/utils/encryption/encryption.server';

async function createShareableLink(balloonId: string, permission: 'READ' | 'WRITE') {
    return encryptString(JSON.stringify({ balloonId, permission }));
}

export const loader = async ({ request, params }: DataFunctionArgs) => {
    const balloonId = requireParameter('balloonId', params);
    const balloon = await prisma.balloon
        .findUnique({ where: { id: balloonId } })
        .then((result) => requireResult<Balloon>(result));
    const user = await requireUser(request);
    await requireOwnership({ balloon, userId: user.id });
    return json({ balloon });
};

export const action = async ({ request, params }: DataFunctionArgs) => {
    const url = new URL(request.url);
    const formData = await request.formData();
    const readPermissions = formData.get('readPermissions')?.toString();
    const writePermissions = formData.get('writePermissions')?.toString();
    if (!readPermissions && !writePermissions) {
        return json({ error: 'Please select permissions in order to create a link' });
    }
    const balloonId = requireParameter('balloonId', params);
    const balloon = await prisma.balloon
        .findUnique({ where: { id: balloonId } })
        .then((result) => requireResult<Balloon>(result));
    const user = await requireUser(request);
    await requireOwnership({ balloon, userId: user.id });
    if (readPermissions && !writePermissions) {
        const code = await createShareableLink(balloonId, 'READ');
        return json({ link: `${url.host}/share/${code}`, permission: 'READ' });
    }
    if (writePermissions) {
        const code = await createShareableLink(balloonId, 'WRITE');
        return json({ link: `${url.host}/share/${code}`, permission: 'WRITE' });
    }
    return null;
};

const ShareBalloonPage = () => {
    const { balloon } = useLoaderData<typeof loader>();
    const [readPermissions, setReadPermissions] = useState(false);
    const [writePermissions, setWritePermissions] = useState(false);
    const fetcher = useFetcher();

    useEffect(() => {
        if (writePermissions && !readPermissions) {
            setReadPermissions(true);
        }
    }, [writePermissions]);

    const navigate = useNavigate();
    const toggleModal = () => {
        navigate(-1);
    };

    const link = fetcher.data?.link;
    const copyLink = () => {
        if (link) {
            navigator.clipboard.writeText(link);
        }
    };

    return (
        <Modal showModal={true} toggleModal={toggleModal}>
            <Card className={'border-none shadow-none'}>
                <CardHeader>
                    <CardTitle>Share {balloon.name}</CardTitle>
                    <CardDescription>
                        Do you want to share {balloon.name}? Adjust the permissions below
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <fetcher.Form className={'space-y-2'} method={'POST'}>
                        <div className='flex items-center space-x-4 rounded-md border p-4'>
                            <BookOpenCheck />
                            <div className='flex-1 space-y-1'>
                                <p className='text-sm font-medium leading-none'>Read permissions</p>
                                <p className='text-sm text-muted-foreground'>
                                    Everyone you send this link to can view your balloon with its
                                    listings.
                                </p>
                            </div>
                            <span className={'flex justify-start'}>
                                <Switch
                                    name={'readPermissions'}
                                    isSelected={readPermissions}
                                    onChange={setReadPermissions}
                                    className='group inline-flex touch-none items-center'
                                    style={{ WebkitTapHighlightColor: 'transparent' }}>
                                    <span className='group-data-[selected]:bg-rose-500 group-data-[focus-visible]:ring-2 mr-4 h-6 w-9 cursor-pointer rounded-full border-2 border-transparent bg-zinc-200 ring-offset-2 ring-offset-zinc-900 transition duration-200'>
                                        <span className='group-data-[selected]:ml-3 group-data-[selected]:group-data-[pressed]:ml-2 group-data-[pressed]:w-6 block h-5 w-5 origin-right rounded-full bg-white shadow transition-all duration-200' />
                                    </span>
                                </Switch>
                            </span>
                        </div>
                        <div className=' flex items-center space-x-4 rounded-md border p-4'>
                            <Pen />
                            <div className='flex-1 space-y-1'>
                                <p className='text-sm font-medium leading-none'>
                                    Write permissions
                                </p>
                                <p className='text-sm text-muted-foreground'>
                                    Everyone you send this link to can view your balloon with its
                                    listings.
                                </p>
                            </div>
                            <span className={'flex justify-start'}>
                                <Switch
                                    name={'writePermissions'}
                                    isSelected={writePermissions}
                                    onChange={setWritePermissions}
                                    className='group inline-flex touch-none items-center'
                                    style={{ WebkitTapHighlightColor: 'transparent' }}>
                                    <span className='group-data-[selected]:bg-rose-500 group-data-[focus-visible]:ring-2 mr-4 h-6 w-9 cursor-pointer rounded-full border-2 border-transparent bg-zinc-200 ring-offset-2 ring-offset-zinc-900 transition duration-200'>
                                        <span className='group-data-[selected]:ml-3 group-data-[selected]:group-data-[pressed]:ml-2 group-data-[pressed]:w-6 block h-5 w-5 origin-right rounded-full bg-white shadow transition-all duration-200' />
                                    </span>
                                </Switch>
                            </span>
                        </div>
                        <p className={'text-sm text-red-600'}>{fetcher.data?.error}</p>
                        <div className={'flex justify-end mt-2'}>
                            <Button>Create shareable link</Button>
                        </div>
                    </fetcher.Form>
                    {link && (
                        <div className={'flex items-center gap-2 mt-2'}>
                            <div
                                className={
                                    'px-5 py-3 rounded-md border border-input text-sm w-full truncate'
                                }>
                                <p className={'max-w-max'}>{fetcher?.data?.link}</p>
                            </div>
                            <div
                                onClick={() => copyLink()}
                                className={
                                    'p-3 rounded-md border border-input hover:cursor-pointer'
                                }>
                                <Clipboard size={20} />
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </Modal>
    );
};

export default ShareBalloonPage;
