import { DataFunctionArgs, redirect } from '@remix-run/node';
import { requireParameter } from '~/utils/form/formdata.server';
import { decryptString } from '~/utils/encryption/encryption.server';
import { assignPermission } from '~/utils/auth/permission.server';

type CodeInfo = {
    balloonId: string;
    permission: 'READ' | 'WRITE';
};

export const loader = async ({ request, params }: DataFunctionArgs) => {
    const code = requireParameter('code', params);
    const info = JSON.parse(decryptString(code)) as CodeInfo;
    const response = await assignPermission(request, info.balloonId, info.permission);
    // return redirect(`/share/${code}`, {
    //     headers: {
    //         'Set-Cookie': response,
    //     },
    // });
    return redirect(`/balloons/${info.balloonId}`, {
        headers: {
            'Set-Cookie': response,
        },
    });
};
