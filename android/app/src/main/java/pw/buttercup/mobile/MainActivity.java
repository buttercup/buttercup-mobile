package pw.buttercup.mobile;

import com.facebook.react.ReactActivity;
import com.rnfs.RNFSPackage;
import org.spongycastle.jce.provider.BouncyCastleProvider;
import java.security.Security;

public class MainActivity extends ReactActivity {

    static {
        Security.insertProviderAt(new BouncyCastleProvider(), 1);
    }

    /**
     * Returns the name of the main component registered from JavaScript. This is
     * used to schedule
     * rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "Buttercup";
    }

}
