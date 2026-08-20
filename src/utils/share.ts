import { Share } from 'react-native';
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';
import type { RefObject } from 'react';

export async function shareText(message: string, title?: string): Promise<void> {
  await Share.share({ message, title }, title ? { dialogTitle: title } : undefined);
}

export async function shareViewAsImage(
  ref: RefObject<any>,
  dialogTitle = 'Compartilhar'
): Promise<void> {
  const uri = await captureRef(ref, { format: 'png', quality: 1 });
  const available = await Sharing.isAvailableAsync();
  if (available) {
    await Sharing.shareAsync(uri, {
      dialogTitle,
      mimeType: 'image/png',
      UTI: 'public.png',
    });
  } else {
    await Share.share({ url: uri, message: dialogTitle });
  }
}
