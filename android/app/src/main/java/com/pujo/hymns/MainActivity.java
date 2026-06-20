package com.pujo.hymns;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import io.github.jofr.capacitor.mediasessionplugin.MediaSessionPlugin;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    registerPlugin(MediaSessionPlugin.class);
  }
}